import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { Tool } from "./_base.js";

export class FileOpsTool extends Tool {
  name = "file_ops";
  description =
    "Read, write, list, or search files in the workspace. Operations: read, write, append, list, search.";
  inputSchema = z.object({
    operation: z.enum(["read", "write", "append", "list", "search"]).describe("The file operation to perform"),
    path: z.string().describe("File or directory path (relative to workspace)"),
    content: z.string().optional().describe("Content for write/append operations"),
    query: z.string().optional().describe("Search query for search operation"),
  });

  private workspaceDir: string;

  constructor(workspaceDir: string) {
    super();
    this.workspaceDir = workspaceDir;
  }

  private resolveSafe(filePath: string): string {
    const resolved = path.resolve(this.workspaceDir, filePath);
    if (!resolved.startsWith(this.workspaceDir)) {
      throw new Error("Path traversal detected: access outside workspace denied");
    }
    return resolved;
  }

  async execute(input: Record<string, unknown>) {
    const parsed = this.inputSchema.parse(input);
    const { operation, content, query } = parsed;
    const filePath = parsed.path;

    try {
      switch (operation) {
        case "read": {
          const resolved = this.resolveSafe(filePath);
          const data = await fs.readFile(resolved, "utf-8");
          return { success: true, output: data.length > 10000 ? data.substring(0, 10000) + "\n...[truncated]" : data };
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
        case "search": {
          if (!query) return { success: false, output: "", error: "Query required for search" };
          const results = await this.searchFiles(this.resolveSafe(filePath), query);
          return { success: true, output: results || "No matches found" };
        }
        default:
          return { success: false, output: "", error: `Unknown operation: ${operation}` };
      }
    } catch (err) {
      return { success: false, output: "", error: err instanceof Error ? err.message : String(err) };
    }
  }

  private async searchFiles(dir: string, query: string, results: string[] = [], depth = 0): Promise<string> {
    if (depth > 5 || results.length > 20) return results.join("\n");
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await this.searchFiles(full, query, results, depth + 1);
      } else {
        try {
          const content = await fs.readFile(full, "utf-8");
          const lines = content.split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(query)) {
              const rel = path.relative(this.workspaceDir, full);
              results.push(`${rel}:${i + 1}: ${lines[i].trim()}`);
              if (results.length >= 20) return results.join("\n");
            }
          }
        } catch {
          // skip binary or unreadable files
        }
      }
    }
    return results.join("\n");
  }
}
