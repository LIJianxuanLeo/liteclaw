import { z } from "zod";

// --- Incoming / Outgoing Messages ---

export interface IncomingMessage {
  id: string;
  from: string; // WhatsApp JID or "scheduler"
  text: string;
  timestamp: number;
}

export interface OutgoingMessage {
  id: string;
  text: string;
  timestamp: number;
}

// --- Decision Types (LLM outputs exactly one) ---

export const ReplyDecisionSchema = z.object({
  type: z.literal("reply"),
  text: z.string(),
});

export const ToolCallDecisionSchema = z.object({
  type: z.literal("tool_call"),
  tool: z.string(),
  args: z.record(z.unknown()),
});

export const ScheduleDecisionSchema = z.object({
  type: z.literal("schedule"),
  job: z.object({
    id: z.string().optional(),
    name: z.string(),
    prompt: z.string(),
    cron: z.string(),
    active: z.boolean().optional().default(true),
  }),
});

export const DecisionSchema = z.discriminatedUnion("type", [
  ReplyDecisionSchema,
  ToolCallDecisionSchema,
  ScheduleDecisionSchema,
]);

export type Decision = z.infer<typeof DecisionSchema>;
export type ReplyDecision = z.infer<typeof ReplyDecisionSchema>;
export type ToolCallDecision = z.infer<typeof ToolCallDecisionSchema>;
export type ScheduleDecision = z.infer<typeof ScheduleDecisionSchema>;

// --- Tool System ---

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

// --- Job / Task ---

export interface Job {
  id: string;
  name: string;
  prompt: string;
  cron: string;
  active: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
  done: boolean;
  createdAt: string;
  completedAt?: string;
}

// --- AuthZ ---

export interface AuthZResult {
  allowed: boolean;
  reason?: string;
}

// --- Config ---

export type LLMProvider = "groq" | "anthropic";

export interface AgentConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  agentName: string;
  dataDir: string;
  notesDir: string;
  whatsappAllowlist: string[];
  logLevel: "debug" | "info" | "warn" | "error";
}
