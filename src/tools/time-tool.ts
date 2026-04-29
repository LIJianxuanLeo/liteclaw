import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Tool } from "./_base.js";
import type { Job } from "../core/types.js";

/**
 * Time and reminder tool — manages time queries and scheduled jobs.
 */
export class TimeTool extends Tool {
  name = "time";
  description =
    "Get current time and manage reminders. Operations: " +
    "now (args: operation='now'); " +
    "create_reminder (args: operation='create_reminder', name=string [required], prompt=string [required, the message to send when fired], cron=string [required, e.g. '* * * * *' for every minute, '0 9 * * *' for 9am daily]); " +
    "list_reminders (args: operation='list_reminders'); " +
    "pause_reminder (args: operation='pause_reminder', id=string [required, copy from list_reminders response]).";
  inputSchema = z.object({
    operation: z.enum(["now", "create_reminder", "list_reminders", "pause_reminder"]),
    name: z.string().optional().describe("Reminder name"),
    prompt: z.string().optional().describe("What to remind about"),
    cron: z.string().optional().describe("Cron expression (e.g. '0 9 * * *' for daily 9am)"),
    id: z.string().optional().describe("Reminder ID for pause"),
  });

  private jobsFile: string;
  private onJobsChanged?: () => void;

  constructor(dataDir: string, onJobsChanged?: () => void) {
    super();
    this.jobsFile = path.join(dataDir, "jobs.json");
    this.onJobsChanged = onJobsChanged;
  }

  private async loadJobs(): Promise<Job[]> {
    try {
      const raw = await fs.readFile(this.jobsFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private async saveJobs(jobs: Job[]): Promise<void> {
    await fs.writeFile(this.jobsFile, JSON.stringify(jobs, null, 2), "utf-8");
    this.onJobsChanged?.();
  }

  async execute(input: Record<string, unknown>) {
    const parsed = this.inputSchema.parse(input);

    try {
      switch (parsed.operation) {
        case "now": {
          const now = new Date();
          return {
            success: true,
            output: `Current time: ${now.toISOString()} (${now.toLocaleString()})`,
          };
        }

        case "create_reminder": {
          if (!parsed.name || !parsed.prompt || !parsed.cron) {
            return { success: false, output: "", error: "name, prompt, and cron are required" };
          }
          const jobs = await this.loadJobs();
          const job: Job = {
            id: randomUUID().substring(0, 8),
            name: parsed.name,
            prompt: parsed.prompt,
            cron: parsed.cron,
            active: true,
            createdAt: new Date().toISOString(),
          };
          jobs.push(job);
          await this.saveJobs(jobs);
          return { success: true, output: `Reminder "${job.name}" created (ID: ${job.id}, cron: ${job.cron})` };
        }

        case "list_reminders": {
          const jobs = await this.loadJobs();
          if (jobs.length === 0) return { success: true, output: "No reminders set." };
          const list = jobs
            .map((j) => `[${j.active ? "ACTIVE" : "PAUSED"}] ${j.id}: "${j.name}" (${j.cron}) — ${j.prompt}`)
            .join("\n");
          return { success: true, output: list };
        }

        case "pause_reminder": {
          if (!parsed.id) return { success: false, output: "", error: "id is required" };
          const jobs = await this.loadJobs();
          const job = jobs.find((j) => j.id === parsed.id);
          if (!job) return { success: false, output: "", error: `Reminder ${parsed.id} not found` };
          job.active = false;
          await this.saveJobs(jobs);
          return { success: true, output: `Reminder "${job.name}" paused.` };
        }

        default:
          return { success: false, output: "", error: `Unknown operation: ${parsed.operation}` };
      }
    } catch (err) {
      return { success: false, output: "", error: err instanceof Error ? err.message : String(err) };
    }
  }
}
