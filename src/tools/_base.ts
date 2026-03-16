import type { z } from "zod";
import type { ExecutableTool } from "../core/tool-registry.js";

export abstract class Tool implements ExecutableTool {
  abstract name: string;
  abstract description: string;
  abstract inputSchema: z.ZodSchema;
  abstract execute(input: Record<string, unknown>): Promise<{ success: boolean; output: string; error?: string }>;
}
