import fs from "fs/promises";
import path from "path";

/**
 * Append-only audit logger.
 * All decisions, tool executions, and AuthZ denials are recorded.
 */
export class AuditLog {
  private filePath: string;

  constructor(dataDir: string) {
    this.filePath = path.join(dataDir, "audit.log");
  }

  async log(action: string, details: Record<string, unknown> = {}): Promise<void> {
    const ts = new Date().toISOString();
    const detailStr = Object.keys(details).length > 0 ? ` ${JSON.stringify(details)}` : "";
    const line = `[${ts}] [${action}]${detailStr}\n`;
    try {
      await fs.appendFile(this.filePath, line, "utf-8");
    } catch {
      // Best-effort — don't crash on audit failure
    }
  }
}
