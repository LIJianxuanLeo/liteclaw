import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { AgentConfig, ToolDefinition } from "./types.js";
import { log } from "../utils/logger.js";
import { zodToJsonSchema } from "../utils/schema.js";

// Unified content block types used across all providers
export interface TextBlock {
  type: "text";
  text: string;
}

export interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export type ContentBlock = TextBlock | ToolUseBlock;

export interface LLMMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

export interface LLMResponse {
  content: ContentBlock[];
  stopReason: string | null;
  usage: { inputTokens: number; outputTokens: number };
}

export interface LLMClient {
  chat(systemPrompt: string, messages: LLMMessage[], tools: ToolDefinition[]): Promise<LLMResponse>;
}

// --- Anthropic Provider ---

export class AnthropicClient implements LLMClient {
  private client: Anthropic;
  private model: string;

  constructor(config: AgentConfig) {
    if (!config.anthropicApiKey) throw new Error("ANTHROPIC_API_KEY is required for anthropic provider");
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
    this.model = config.model;
  }

  async chat(systemPrompt: string, messages: LLMMessage[], tools: ToolDefinition[]): Promise<LLMResponse> {
    const anthropicTools: Anthropic.Tool[] = tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: zodToJsonSchema(t.inputSchema) as Anthropic.Tool.InputSchema,
    }));

    log.debug("Anthropic request", { messageCount: messages.length, toolCount: anthropicTools.length });

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((m) => {
      if (typeof m.content === "string") {
        return { role: m.role, content: m.content };
      }
      // Content blocks — map our unified format to Anthropic's
      const blocks = m.content.map((b) => {
        if (b.type === "text") return { type: "text" as const, text: b.text };
        if (b.type === "tool_use") return { type: "tool_use" as const, id: b.id, name: b.name, input: b.input };
        return b;
      });
      return { role: m.role, content: blocks };
    });

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages as Anthropic.MessageParam[],
      tools: anthropicTools.length > 0 ? anthropicTools : undefined,
    });

    // Normalize Anthropic response to our unified format
    const content: ContentBlock[] = response.content.map((b) => {
      if (b.type === "text") return { type: "text", text: b.text };
      if (b.type === "tool_use") return { type: "tool_use", id: b.id, name: b.name, input: b.input as Record<string, unknown> };
      return { type: "text", text: "" };
    });

    return {
      content,
      stopReason: response.stop_reason,
      usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens },
    };
  }
}

// --- OpenAI-Compatible Provider (DeepSeek, Groq, etc.) ---

interface OpenAIProviderConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

export class OpenAICompatibleClient implements LLMClient {
  private client: OpenAI;
  private model: string;

  constructor(providerConfig: OpenAIProviderConfig) {
    if (!providerConfig.apiKey) throw new Error(`API key is required (baseURL: ${providerConfig.baseURL})`);
    this.client = new OpenAI({
      apiKey: providerConfig.apiKey,
      baseURL: providerConfig.baseURL,
    });
    this.model = providerConfig.model;
  }

  async chat(systemPrompt: string, messages: LLMMessage[], tools: ToolDefinition[]): Promise<LLMResponse> {
    log.debug("OpenAI-compatible request", { model: this.model, messageCount: messages.length });

    // Build OpenAI-format messages
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    for (const m of messages) {
      if (typeof m.content === "string") {
        openaiMessages.push({ role: m.role, content: m.content });
      } else if (m.role === "assistant") {
        // Assistant message with possible tool calls
        const textParts = m.content.filter((b): b is TextBlock => b.type === "text");
        const toolParts = m.content.filter((b): b is ToolUseBlock => b.type === "tool_use");
        const text = textParts.map((b) => b.text).join("");

        const msg: OpenAI.Chat.ChatCompletionAssistantMessageParam = {
          role: "assistant",
          content: text || null,
        };

        if (toolParts.length > 0) {
          msg.tool_calls = toolParts.map((t) => ({
            id: t.id,
            type: "function" as const,
            function: { name: t.name, arguments: JSON.stringify(t.input) },
          }));
        }

        openaiMessages.push(msg);
      } else {
        // User message — could be tool results or plain text
        const blocks = m.content;
        const toolResults = blocks.filter((b: any) => b.type === "tool_result");

        if (toolResults.length > 0) {
          // These are tool results — add each as a separate tool message
          for (const tr of toolResults as any[]) {
            openaiMessages.push({
              role: "tool",
              tool_call_id: tr.tool_use_id,
              content: tr.content ?? "",
            });
          }
        } else {
          const text = blocks
            .filter((b): b is TextBlock => b.type === "text")
            .map((b) => b.text)
            .join("");
          openaiMessages.push({ role: "user", content: text });
        }
      }
    }

    // Build tools
    const openaiTools: OpenAI.Chat.ChatCompletionTool[] | undefined =
      tools.length > 0
        ? tools.map((t) => ({
            type: "function" as const,
            function: {
              name: t.name,
              description: t.description,
              parameters: zodToJsonSchema(t.inputSchema),
            },
          }))
        : undefined;

    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 4096,
      messages: openaiMessages,
      tools: openaiTools,
    });

    const choice = response.choices[0];
    const content: ContentBlock[] = [];

    // Extract text
    if (choice.message.content) {
      content.push({ type: "text", text: choice.message.content });
    }

    // Extract tool calls
    if (choice.message.tool_calls) {
      for (const tc of choice.message.tool_calls) {
        if (tc.type !== "function") continue;
        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = JSON.parse(tc.function.arguments);
        } catch {
          parsedArgs = { raw: tc.function.arguments };
        }
        content.push({
          type: "tool_use",
          id: tc.id,
          name: tc.function.name,
          input: parsedArgs,
        });
      }
    }

    return {
      content,
      stopReason: choice.finish_reason,
      usage: {
        inputTokens: response.usage?.prompt_tokens ?? 0,
        outputTokens: response.usage?.completion_tokens ?? 0,
      },
    };
  }
}

// --- Factory ---

const PROVIDER_URLS: Record<string, string> = {
  deepseek: "https://api.deepseek.com",
  groq: "https://api.groq.com/openai/v1",
  doubao: "https://ark.cn-beijing.volces.com/api/v3",
};

export function createLLMClient(config: AgentConfig): LLMClient {
  switch (config.provider) {
    case "anthropic":
      return new AnthropicClient(config);

    case "deepseek":
      return new OpenAICompatibleClient({
        apiKey: config.deepseekApiKey,
        baseURL: PROVIDER_URLS.deepseek,
        model: config.model,
      });

    case "groq":
      return new OpenAICompatibleClient({
        apiKey: config.groqApiKey,
        baseURL: PROVIDER_URLS.groq,
        model: config.model,
      });

    case "doubao":
      return new OpenAICompatibleClient({
        apiKey: config.doubaoApiKey,
        baseURL: PROVIDER_URLS.doubao,
        model: config.model,
      });

    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}
