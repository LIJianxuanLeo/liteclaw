import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { Tool } from "./_base.js";

/**
 * File operations tool — restricted to allowed directories only.
 * Operations: read, write, append, list
 */
export class FileOpsTool extends Tool {
  name = "file_ops";
  description =
    "Read, write, append, or list files. Restricted to data/ and notes/ directories only.";
  inputSchema = z.object({
    operation: z.enum(["read", "write", "append", "list"]).describe("The file operation"),
    path: z.string().describe("File or directory path (relative to allowed dirs)"),
    content: z.string().optional().describe("Content for write/append"),
  });

  private allowedDirs: string[];

  constructor(allowedDirs: string[]) {
    super();
    this.allowedDirs = allowedDirs.map((d) => path.resolve(d));
  }

  private resolveSafe(filePath: string): string {
    // Try resolving against each allowed directory
    for (const dir of this.allowedDirs) {
      const resolved = path.resolve(dir, filePath);
      if (resolved.startsWith(dir + path.sep) || resolved === dir) {
        return resolved;
      }
    }
    // Also try as absolute path if within allowed dirs
    const abs = path.resolve(filePath);
    for (const dir of this.allowedDirs) {
      if (abs.startsWith(dir + path.sep) || abs === dir) {
        return abs;
      }
    }
    throw new Error(`Path "${filePath}" is outside allowed directories`);
  }

  async execute(input: Record<string, unknown>) {
    const parsed = this.inputSchema.parse(input);
    const { operation, content } = parsed;
    const filePath = parsed.path;

    try {
      switch (operation) {
        case "read": {
          const resolved = this.resolveSafe(filePath);
          const data = await fs.readFile(resolved, "utf-8");
          return {
            success: true,
            output: data.length > 10000 ? data.substring(0, 10000) + "\n...[truncated]" : data,
          };
        }
        case "write": {
          if (!content) return { success: false, output: "", error: "Content required for write" };
          const resolved = this.resolveSafe(filePath);
          await fs.mkdir(path.dirname(resolved), { recursive: true });
          await fs.writeFile(resolved, content, "utf-8");
          return { success: true, output: `Written ${content.length} bytes to ${filePath}` };
        }
        case "append": {
          if (!content) return { success: false, output: "", error: "Content required for append" };
          const resolved = this.resolveSafe(filePath);
          await fs.appendFile(resolved, content, "utf-8");
          return { success: true, output: `Appended ${content.length} bytes to ${filePath}` };
        }
        case "list": {
          const resolved = this.resolveSafe(filePath);
          const entries = await fs.readdir(resolved, { withFileTypes: true });
          const listing = entries
            .map((e) => `${e.isDirectory() ? "[dir]" : "[file]"} ${e.name}`)
            .join("\n");
          return { success: true, output: listing || "(empty directory)" };
        }
        default:
          return { success: false, output: "", error: `Unknown operation: ${operation}` };
      }
    } catch (err) {
      return { success: false, output: "", error: err instanceof Error ? err.message : String(err) };
    }
  }
}
