import { config as dotenvConfig } from "dotenv";
import path from "path";
import type { AgentConfig, LLMProvider } from "../core/types.js";

dotenvConfig();

function env(key: string, fallback?: string): string {
  const val = process.env[key] ?? fallback;
  if (val === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val;
}

const DEFAULT_MODELS: Record<LLMProvider, string> = {
  anthropic: "claude-sonnet-4-20250514",
  deepseek: "deepseek-chat",
  groq: "llama-3.3-70b-versatile",
};

export function loadConfig(): AgentConfig {
  const provider = env("LLM_PROVIDER", "anthropic") as LLMProvider;

  return {
    provider,
    anthropicApiKey: env("ANTHROPIC_API_KEY", ""),
    deepseekApiKey: env("DEEPSEEK_API_KEY", ""),
    groqApiKey: env("GROQ_API_KEY", ""),
    agentName: env("AGENT_NAME", "LiteClaw"),
    workspaceDir: path.resolve(env("WORKSPACE_DIR", "./workspace")),
    maxToolDepth: parseInt(env("MAX_TOOL_DEPTH", "10"), 10),
    logLevel: env("LOG_LEVEL", "info") as AgentConfig["logLevel"],
    channel: env("CHANNEL", "cli") as AgentConfig["channel"],
    port: parseInt(env("PORT", "3000"), 10),
    model: env("MODEL", DEFAULT_MODELS[provider]),
  };
}
