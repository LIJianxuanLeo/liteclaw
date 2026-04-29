import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { Tool } from "./_base.js";

/**
 * Notes tool — daily notes, journal entries, weekly summaries.
 */
export class NotesTool extends Tool {
  name = "notes";
  description =
    "Manage daily notes and journal. Operations: " +
    "daily_note (args: operation='daily_note', date=YYYY-MM-DD [optional, default today], returns the day's note); " +
    "append_journal (args: operation='append_journal', text=string [required], date=YYYY-MM-DD [optional, default today], appends timestamped entry); " +
    "weekly_summary (args: operation='weekly_summary', returns the past 7 days of notes).";
  inputSchema = z.object({
    operation: z.enum(["daily_note", "append_journal", "weekly_summary"]),
    text: z.string().optional().describe("Journal entry text"),
    date: z.string().optional().describe("Date in YYYY-MM-DD format (default: today)"),
  });

  private notesDir: string;

  constructor(notesDir: string) {
    super();
    this.notesDir = notesDir;
  }

  private getDateStr(date?: string): string {
    if (date) return date;
    return new Date().toISOString().split("T")[0];
  }

  private notePath(dateStr: string): string {
    return path.join(this.notesDir, `${dateStr}.md`);
  }

  async execute(input: Record<string, unknown>) {
    const parsed = this.inputSchema.parse(input);

    try {
      await fs.mkdir(this.notesDir, { recursive: true });

      switch (parsed.operation) {
        case "daily_note": {
          const dateStr = this.getDateStr(parsed.date);
          const filePath = this.notePath(dateStr);
          try {
            const content = await fs.readFile(filePath, "utf-8");
            return { success: true, output: `Daily note for ${dateStr}:\n${content}` };
          } catch {
            // Create empty note
            const header = `# Daily Note — ${dateStr}\n\n`;
            await fs.writeFile(filePath, header, "utf-8");
            return { success: true, output: `Created new daily note for ${dateStr} (empty)` };
          }
        }

        case "append_journal": {
          if (!parsed.text) return { success: false, output: "", error: "text is required" };
          const dateStr = this.getDateStr(parsed.date);
          const filePath = this.notePath(dateStr);

          // Create file if it doesn't exist
          try {
            await fs.access(filePath);
          } catch {
            await fs.writeFile(filePath, `# Daily Note — ${dateStr}\n\n`, "utf-8");
          }

          const time = new Date().toLocaleTimeString("en-US", { hour12: false });
          const entry = `- **${time}** — ${parsed.text}\n`;
          await fs.appendFile(filePath, entry, "utf-8");
          return { success: true, output: `Journal entry added to ${dateStr}` };
        }

        case "weekly_summary": {
          const today = new Date();
          const notes: string[] = [];

          for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            const filePath = this.notePath(dateStr);
            try {
              const content = await fs.readFile(filePath, "utf-8");
              notes.push(`--- ${dateStr} ---\n${content.trim()}`);
            } catch {
              // No note for this day
            }
          }

          if (notes.length === 0) {
            return { success: true, output: "No daily notes found in the past 7 days." };
          }

          return { success: true, output: `Weekly summary (${notes.length} days with notes):\n\n${notes.join("\n\n")}` };
        }

        default:
          return { success: false, output: "", error: `Unknown operation: ${parsed.operation}` };
      }
    } catch (err) {
      return { success: false, output: "", error: err instanceof Error ? err.message : String(err) };
    }
  }
}
