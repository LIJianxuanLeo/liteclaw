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

    // For file operations, validate path is within allowed directories.
    // Mirrors FileOpsTool.resolveSafe(): a relative path is allowed if it
    // resolves inside any of the allowed directories.
    if (toolBase === "file_ops") {
      const filePath = args.path as string | undefined;
      if (filePath) {
        // Try each allowed dir as the base for the (possibly relative) path
        const matchedRelative = this.allowedDirs.some((dir) => {
          const r = path.resolve(dir, filePath);
          return r.startsWith(dir + path.sep) || r === dir;
        });
        // Also accept absolute paths that already lie within an allowed dir
        const abs = path.resolve(filePath);
        const matchedAbsolute = this.allowedDirs.some((dir) => abs.startsWith(dir + path.sep) || abs === dir);

        if (!matchedRelative && !matchedAbsolute) {
          log.warn("AuthZ: path outside allowed dirs", { tool, path: filePath, resolved: abs });
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
