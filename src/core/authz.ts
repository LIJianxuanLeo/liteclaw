import path from "path";
import type { AuthZResult } from "./types.js";
import { log } from "../utils/logger.js";

/**
 * Authorization wall — checks whether a tool call is permitted.
 * Default-deny: anything not explicitly allowed is rejected.
 */
export class AuthZ {
  private allowedDirs: string[];

  constructor(allowedDirs: string[]) {
    // Resolve to absolute paths for comparison
    this.allowedDirs = allowedDirs.map((d) => path.resolve(d));
  }

  check(tool: string, args: Record<string, unknown> = {}): AuthZResult {
    // Permanently denied tools
    if (tool.startsWith("network") || tool.startsWith("exec") || tool.startsWith("shell")) {
      return { allowed: false, reason: `Tool category "${tool}" is permanently forbidden` };
    }

    // Allowed tool categories
    const allowedCategories = ["time", "todo", "notes", "schedule", "file_ops"];
    const toolBase = tool.split(".")[0];

    if (!allowedCategories.includes(toolBase)) {
      return { allowed: false, reason: `Unknown tool "${tool}" — default deny` };
    }

    // For file operations, validate path is within allowed directories
    if (toolBase === "file_ops") {
      const filePath = args.path as string | undefined;
      if (filePath) {
        const resolved = path.resolve(filePath);
        const isAllowed = this.allowedDirs.some((dir) => resolved.startsWith(dir + path.sep) || resolved === dir);
        if (!isAllowed) {
          log.warn("AuthZ: path traversal blocked", { tool, path: filePath, resolved });
          return {
            allowed: false,
            reason: `Path "${filePath}" is outside allowed directories`,
          };
        }
      }
    }

    return { allowed: true };
  }
}
