import cron from "node-cron";
import fs from "fs/promises";
import path from "path";
import type { Job, IncomingMessage } from "../core/types.js";
import type { Agent } from "../core/agent.js";
import type { WhatsAppChannel } from "../channel/whatsapp.js";
import { log } from "../utils/logger.js";

interface ScheduledTask {
  jobId: string;
  task: cron.ScheduledTask;
}

/**
 * Scheduler — loads jobs from jobs.json and creates cron tasks.
 * On fire: calls agent.handle() and sends result via WhatsApp.
 */
export class Scheduler {
  private dataDir: string;
  private agent: Agent;
  private whatsapp: WhatsAppChannel | null;
  private defaultRecipient: string;
  private tasks: ScheduledTask[] = [];

  constructor(
    dataDir: string,
    agent: Agent,
    whatsapp: WhatsAppChannel | null,
    defaultRecipient: string
  ) {
    this.dataDir = dataDir;
    this.agent = agent;
    this.whatsapp = whatsapp;
    this.defaultRecipient = defaultRecipient;
  }

  async start(): Promise<void> {
    await this.reload();
    log.info("Scheduler started", { taskCount: this.tasks.length });
  }

  async reload(): Promise<void> {
    // Stop existing tasks
    this.stopAll();

    // Load jobs
    const jobs = await this.loadJobs();
    const activeJobs = jobs.filter((j) => j.active);

    for (const job of activeJobs) {
      if (!cron.validate(job.cron)) {
        log.warn("Invalid cron expression, skipping", { jobId: job.id, cron: job.cron });
        continue;
      }

      const task = cron.schedule(job.cron, async () => {
        log.info("Cron job fired", { jobId: job.id, name: job.name });
        await this.executeJob(job);
      });

      this.tasks.push({ jobId: job.id, task });
      log.debug("Scheduled cron job", { jobId: job.id, name: job.name, cron: job.cron });
    }

    log.info("Scheduler reloaded", { activeJobs: activeJobs.length, totalJobs: jobs.length });
  }

  private async executeJob(job: Job): Promise<void> {
    const msg: IncomingMessage = {
      id: `cron-${job.id}-${Date.now()}`,
      from: "scheduler",
      text: job.prompt,
      timestamp: Math.floor(Date.now() / 1000),
    };

    try {
      const response = await this.agent.handle(msg);

      // Send result via WhatsApp if channel is available
      if (this.whatsapp && this.defaultRecipient) {
        const formatted = `🔔 *${job.name}*\n\n${response}`;
        await this.whatsapp.sendToPhone(this.defaultRecipient, formatted);
      }

      log.info("Cron job completed", { jobId: job.id, responseLength: response.length });
    } catch (err) {
      log.error("Cron job failed", { jobId: job.id, error: String(err) });
    }
  }

  private async loadJobs(): Promise<Job[]> {
    try {
      const raw = await fs.readFile(path.join(this.dataDir, "jobs.json"), "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private stopAll(): void {
    for (const { task } of this.tasks) {
      task.stop();
    }
    this.tasks = [];
  }

  stop(): void {
    this.stopAll();
    log.info("Scheduler stopped");
  }
}
