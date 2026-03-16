import { randomUUID } from "crypto";
import type {
  AgentConfig,
  AgentState,
  IncomingMessage,
  OutgoingMessage,
  ToolCall,
  ToolCallRecord,
  WSEvent,
} from "./types.js";
import type { LLMClient, LLMMessage, TextBlock, ToolUseBlock } from "./llm.js";
import { ToolRegistry } from "./tool-registry.js";
import { log } from "../utils/logger.js";

const SYSTEM_PROMPT = `You are {agentName}, a helpful AI assistant with access to tools.
You can use tools to interact with the user's system: execute shell commands, read/write files, fetch web pages, and manage memory.
When using tools, think step by step about what you need to accomplish.
Be concise and direct in your responses.
If a task requires multiple steps, use tools iteratively until the task is complete.`;

export type EventEmitter = (event: WSEvent) => void;

export class Agent {
  private config: AgentConfig;
  private llm: LLMClient;
  private toolRegistry: ToolRegistry;
  private state: AgentState = "idle";

  constructor(config: AgentConfig, llm: LLMClient, toolRegistry: ToolRegistry) {
    this.config = config;
    this.llm = llm;
    this.toolRegistry = toolRegistry;
  }

  getState(): AgentState {
    return this.state;
  }

  async processMessage(
    message: IncomingMessage,
    conversationHistory: LLMMessage[],
    onEvent?: EventEmitter
  ): Promise<OutgoingMessage> {
    const emit = onEvent ?? (() => {});
    const allToolCalls: ToolCallRecord[] = [];

    // Add user message to history
    conversationHistory.push({ role: "user", content: message.text });

    const systemPrompt = SYSTEM_PROMPT.replace("{agentName}", this.config.agentName);
    const tools = this.toolRegistry.getDefinitions();

    let depth = 0;

    while (depth < this.config.maxToolDepth) {
      depth++;
      this.state = "thinking";
      emit({ type: "status", state: "thinking" });

      let response;
      try {
        response = await this.llm.chat(systemPrompt, conversationHistory, tools);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        log.error("LLM call failed", errMsg);
        this.state = "idle";
        emit({ type: "error", message: errMsg });
        return {
          id: randomUUID(),
          conversationId: message.conversationId,
          text: `Error: ${errMsg}`,
          timestamp: Date.now(),
        };
      }

      // Extract text and tool_use blocks from unified format
      const textBlocks = response.content.filter(
        (b): b is TextBlock => b.type === "text"
      );
      const toolUseBlocks = response.content.filter(
        (b): b is ToolUseBlock => b.type === "tool_use"
      );

      // Stream text deltas
      for (const block of textBlocks) {
        if (block.text) {
          emit({ type: "text_delta", text: block.text });
        }
      }

      // If no tool calls, we're done
      if (toolUseBlocks.length === 0) {
        const finalText = textBlocks.map((b) => b.text).join("");
        conversationHistory.push({ role: "assistant", content: response.content });

        this.state = "idle";
        const outMsg: OutgoingMessage = {
          id: randomUUID(),
          conversationId: message.conversationId,
          text: finalText,
          toolCalls: allToolCalls.length > 0 ? allToolCalls : undefined,
          timestamp: Date.now(),
        };
        emit({ type: "message_complete", message: outMsg });
        return outMsg;
      }

      // Execute tool calls
      this.state = "tool_execution";
      emit({ type: "status", state: "tool_execution" });

      // Add assistant message with tool use to history
      conversationHistory.push({ role: "assistant", content: response.content });

      const toolResults: any[] = [];

      for (const block of toolUseBlocks) {
        const call: ToolCall = {
          id: block.id,
          name: block.name,
          input: block.input,
        };

        emit({ type: "tool_call", name: call.name, input: call.input });

        const result = await this.toolRegistry.execute(call);

        const record: ToolCallRecord = {
          name: call.name,
          input: call.input,
          output: result.success ? result.output : (result.error ?? "Unknown error"),
          success: result.success,
        };
        allToolCalls.push(record);

        emit({
          type: "tool_result",
          name: call.name,
          output: record.output,
          success: result.success,
        });

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result.success ? result.output : `Error: ${result.error}`,
          is_error: !result.success,
        });
      }

      // Add tool results to history
      conversationHistory.push({
        role: "user",
        content: toolResults,
      });
    }

    // Max depth reached
    log.warn("Max tool depth reached", { depth });
    this.state = "idle";
    const outMsg: OutgoingMessage = {
      id: randomUUID(),
      conversationId: message.conversationId,
      text: "I've reached the maximum number of tool calls for this request. Here's what I've done so far.",
      toolCalls: allToolCalls,
      timestamp: Date.now(),
    };
    emit({ type: "message_complete", message: outMsg });
    return outMsg;
  }
}
