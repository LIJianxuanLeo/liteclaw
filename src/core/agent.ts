import type { AgentConfig, IncomingMessage, Decision, ToolCallDecision } from "./types.js";
import type { LLMClient, LLMMessage } from "./llm.js";
import { ToolRegistry } from "./tool-registry.js";
import { AuthZ } from "./authz.js";
import { ContextLoader } from "../memory/context-loader.js";
import { MemoryManager } from "../memory/memory-manager.js";
import { AuditLog } from "../utils/audit.js";
import { parseDecision, fallbackReply, DecisionParseError } from "./decision.js";
import { log } from "../utils/logger.js";

const SYSTEM_PROMPT_TEMPLATE = `You are {agentName}, a personal AI assistant connected via WhatsApp.
You are helpful, concise, and proactive. You respond in the same language the user writes in.

You MUST respond with exactly ONE JSON object (no extra text, no markdown) in one of these formats:

1. Direct reply:
{{"type": "reply", "text": "your message"}}

2. Use a tool:
{{"type": "tool_call", "tool": "tool_name", "args": {{...}}}}

3. Schedule a recurring job:
{{"type": "schedule", "job": {{"name": "...", "prompt": "...", "cron": "...", "active": true}}}}

{context}

IMPORTANT: Output ONLY valid JSON. No explanation, no markdown fences.`;

export class Agent {
  private config: AgentConfig;
  private llm: LLMClient;
  private tools: ToolRegistry;
  private authz: AuthZ;
  private memory: MemoryManager;
  private contextLoader: ContextLoader;
  private audit: AuditLog;

  constructor(
    config: AgentConfig,
    llm: LLMClient,
    tools: ToolRegistry,
    authz: AuthZ,
    memory: MemoryManager,
    contextLoader: ContextLoader,
    audit: AuditLog
  ) {
    this.config = config;
    this.llm = llm;
    this.tools = tools;
    this.authz = authz;
    this.memory = memory;
    this.contextLoader = contextLoader;
    this.audit = audit;
  }

  /**
   * Handle a single incoming message → return response text.
   * Single-decision-per-turn: no agentic loop.
   */
  async handle(msg: IncomingMessage): Promise<string> {
    log.info("Handling message", { from: msg.from, text: msg.text.substring(0, 80) });

    // 1. Build context
    const context = await this.contextLoader.buildContext(this.tools.getDefinitions());
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE
      .replace("{agentName}", this.config.agentName)
      .replace("{context}", context);

    // 2. Store user message in conversation history
    await this.memory.appendConversation("User", msg.text);

    // 3. Call LLM
    const messages: LLMMessage[] = [{ role: "user", content: msg.text }];
    let decision: Decision;

    try {
      const raw = await this.llm.chat(systemPrompt, messages);
      decision = parseDecision(raw);
    } catch (err) {
      const errorMsg = err instanceof DecisionParseError ? err.message : String(err);
      log.error("Decision parse failed", { error: errorMsg });
      await this.audit.log("decision_error", { from: msg.from, error: errorMsg });
      decision = fallbackReply(errorMsg);
    }

    // 4. Execute decision
    let responseText: string;

    switch (decision.type) {
      case "reply": {
        responseText = decision.text;
        await this.audit.log("reply", { from: msg.from, text: responseText.substring(0, 100) });
        break;
      }

      case "tool_call": {
        responseText = await this.handleToolCall(decision, msg.from);
        break;
      }

      case "schedule": {
        // Schedule decisions are handled by writing to jobs.json via time tool
        const { job } = decision;
        const result = await this.tools.execute({
          id: `schedule-${Date.now()}`,
          name: "time",
          input: {
            operation: "create_reminder",
            name: job.name,
            prompt: job.prompt,
            cron: job.cron,
          },
        });
        responseText = result.success
          ? `✅ Scheduled: "${job.name}" (${job.cron})\n${result.output}`
          : `❌ Failed to schedule: ${result.error}`;
        await this.audit.log("schedule", { from: msg.from, job: job.name, cron: job.cron, success: result.success });
        break;
      }

      default:
        responseText = "I'm not sure how to handle that. Please try again.";
    }

    // 5. Store assistant response
    await this.memory.appendConversation("Assistant", responseText);

    return responseText;
  }

  private async handleToolCall(decision: ToolCallDecision, from: string): Promise<string> {
    // AuthZ check
    const authResult = this.authz.check(decision.tool, decision.args);
    if (!authResult.allowed) {
      const msg = `🚫 Permission denied: ${authResult.reason}`;
      await this.audit.log("authz_denied", { from, tool: decision.tool, reason: authResult.reason });
      return msg;
    }

    // Execute tool
    const result = await this.tools.execute({
      id: `tool-${Date.now()}`,
      name: decision.tool,
      input: decision.args,
    });

    await this.audit.log("tool_call", {
      from,
      tool: decision.tool,
      success: result.success,
      outputLength: result.output.length,
    });

    if (result.success) {
      return result.output;
    } else {
      return `❌ Tool error (${decision.tool}): ${result.error}`;
    }
  }
}
