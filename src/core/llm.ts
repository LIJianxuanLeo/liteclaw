import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { AgentConfig } from "./types.js";
import { log } from "../utils/logger.js";

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMClient {
  /** Send messages to LLM and receive raw text (expected JSON) */
  chat(systemPrompt: string, messages: LLMMessage[]): Promise<string>;
}

// --- Groq (via OpenAI SDK with JSON mode) ---

class GroqClient implements LLMClient {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
    this.model = model;
  }

  async chat(systemPrompt: string, messages: LLMMessage[]): Promise<string> {
    log.debug("Groq request", { model: this.model, messageCount: messages.length });

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: openaiMessages,
      response_format: { type: "json_object" },
      max_tokens: 2048,
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content ?? "";
    log.debug("Groq response", { tokens: response.usage?.total_tokens });
    return text;
  }
}

// --- Anthropic ---

class AnthropicLLMClient implements LLMClient {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async chat(systemPrompt: string, messages: LLMMessage[]): Promise<string> {
    log.debug("Anthropic request", { model: this.model, messageCount: messages.length });

    const anthropicMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as Anthropic.TextBlock).text)
      .join("");

    log.debug("Anthropic response", { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens });
    return text;
  }
}

// --- Factory ---

export function createLLMClient(config: AgentConfig): LLMClient {
  switch (config.provider) {
    case "groq":
      return new GroqClient(config.apiKey, config.model);
    case "anthropic":
      return new AnthropicLLMClient(config.apiKey, config.model);
    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}
