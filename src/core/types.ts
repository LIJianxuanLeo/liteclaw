import { z } from "zod";

// Agent states
export type AgentState = "idle" | "thinking" | "tool_execution" | "responding";

// Channel-agnostic message types
export interface IncomingMessage {
  id: string;
  conversationId: string;
  channel: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface OutgoingMessage {
  id: string;
  conversationId: string;
  text: string;
  toolCalls?: ToolCallRecord[];
  timestamp: number;
}

// Tool system types
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  success: boolean;
  output: string;
  error?: string;
}

export interface ToolCallRecord {
  name: string;
  input: Record<string, unknown>;
  output: string;
  success: boolean;
}

// Conversation types
export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallRecord[];
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  turns: ConversationTurn[];
  createdAt: number;
  updatedAt: number;
}

// Skill types
export interface SkillDefinition {
  name: string;
  description: string;
  triggers: string[];
  tools: string[];
  instructions: string;
}

// LLM Provider types
export type LLMProvider = "anthropic" | "deepseek" | "groq";

// Configuration
export interface AgentConfig {
  provider: LLMProvider;
  anthropicApiKey: string;
  deepseekApiKey: string;
  groqApiKey: string;
  agentName: string;
  workspaceDir: string;
  maxToolDepth: number;
  logLevel: "debug" | "info" | "warn" | "error";
  channel: "cli" | "telegram" | "web";
  port: number;
  model: string;
}

// WebSocket event types for frontend streaming
export type WSEvent =
  | { type: "status"; state: AgentState; detail?: string }
  | { type: "tool_call"; name: string; input: Record<string, unknown> }
  | { type: "tool_result"; name: string; output: string; success: boolean }
  | { type: "text_delta"; text: string }
  | { type: "message_complete"; message: OutgoingMessage }
  | { type: "error"; message: string };
