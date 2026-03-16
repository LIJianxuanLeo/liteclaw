import type { ToolDefinition, ToolCall, ToolResult } from "./types.js";
import { log } from "../utils/logger.js";

export interface ExecutableTool extends ToolDefinition {
  execute(input: Record<string, unknown>): Promise<{ success: boolean; output: string; error?: string }>;
}

export class ToolRegistry {
  private tools = new Map<string, ExecutableTool>();

  register(tool: ExecutableTool) {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool "${tool.name}" is already registered`);
    }
    log.info(`Registered tool: ${tool.name}`);
    this.tools.set(tool.name, tool);
  }

  getDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    }));
  }

  async execute(call: ToolCall, timeoutMs = 30000): Promise<ToolResult> {
    const tool = this.tools.get(call.name);
    if (!tool) {
      return {
        toolCallId: call.id,
        success: false,
        output: "",
        error: `Unknown tool: ${call.name}`,
      };
    }

    log.info(`Executing tool: ${call.name}`, call.input);

    try {
      const result = await Promise.race([
        tool.execute(call.input),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Tool "${call.name}" timed out after ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);

      log.debug(`Tool result: ${call.name}`, { success: result.success, outputLength: result.output.length });

      return {
        toolCallId: call.id,
        success: result.success,
        output: result.output,
        error: result.error,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log.error(`Tool error: ${call.name}`, message);
      return {
        toolCallId: call.id,
        success: false,
        output: "",
        error: message,
      };
    }
  }
}
