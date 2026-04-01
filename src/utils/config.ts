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
  groq: "llama-3.3-70b-versatile",
  anthropic: "claude-sonnet-4-20250514",
};

export function loadConfig(): AgentConfig {
  const provider = env("LLM_PROVIDER", "groq") as LLMProvider;
  const allowlistRaw = env("WHATSAPP_ALLOWLIST", "");

  return {
    provider,
    apiKey: env("API_KEY"),
    model: env("MODEL", DEFAULT_MODELS[provider]),
    agentName: env("AGENT_NAME", "LiteClaw"),
    dataDir: path.resolve(env("DATA_DIR", "./data")),
    notesDir: path.resolve(env("NOTES_DIR", "./notes")),
    whatsappAllowlist: allowlistRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    logLevel: env("LOG_LEVEL", "info") as AgentConfig["logLevel"],
  };
}
