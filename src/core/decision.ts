import { DecisionSchema, type Decision } from "./types.js";
import { log } from "../utils/logger.js";

export class DecisionParseError extends Error {
  constructor(
    message: string,
    public raw: string
  ) {
    super(message);
    this.name = "DecisionParseError";
  }
}

/**
 * Parse raw LLM output into a typed Decision.
 * Strips markdown code fences, parses JSON, validates against schema.
 */
export function parseDecision(raw: string): Decision {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  // Try to extract JSON from the response if it contains extra text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    log.warn("Failed to parse LLM output as JSON", { raw: raw.substring(0, 200) });
    throw new DecisionParseError(`Invalid JSON: ${cleaned.substring(0, 100)}`, raw);
  }

  const result = DecisionSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    log.warn("Decision validation failed", { issues });
    throw new DecisionParseError(`Schema validation failed: ${issues}`, raw);
  }

  return result.data;
}

/**
 * Create a safe fallback reply when decision parsing fails.
 */
export function fallbackReply(error: string): Decision {
  return {
    type: "reply",
    text: `I encountered an issue processing your request. Please try again. (${error})`,
  };
}
