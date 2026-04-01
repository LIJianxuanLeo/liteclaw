import fs from "fs/promises";
import path from "path";
import { MemoryManager } from "./memory-manager.js";
import type { ToolDefinition, Task, Job } from "../core/types.js";
import { log } from "../utils/logger.js";

/**
 * Assembles the full context injected into the LLM system prompt.
 */
export class ContextLoader {
  private memory: MemoryManager;
  private dataDir: string;

  constructor(memory: MemoryManager, dataDir: string) {
    this.memory = memory;
    this.dataDir = dataDir;
  }

  async buildContext(tools: ToolDefinition[]): Promise<string> {
    const parts: string[] = [];

    // Current time
    parts.push(`[Current Time] ${new Date().toISOString()}`);

    // Long-term memory
    const longTerm = await this.memory.loadMemory();
    if (longTerm.trim()) {
      parts.push(`[Long-term Memory]\n${longTerm.trim()}`);
    }

    // Recent conversation
    const recent = await this.memory.loadRecentConversation(10);
    if (recent.trim()) {
      parts.push(`[Recent Conversation]\n${recent.trim()}`);
    }

    // Available tools
    const toolList = tools
      .map((t) => `- ${t.name}: ${t.description}`)
      .join("\n");
    parts.push(`[Available Tools]\n${toolList}`);

    // Pending tasks summary
    const tasks = await this.loadTasks();
    const pendingTasks = tasks.filter((t) => !t.done);
    if (pendingTasks.length > 0) {
      const taskList = pendingTasks
        .map((t) => `- [${t.priority}] ${t.text}`)
        .join("\n");
      parts.push(`[Pending Tasks: ${pendingTasks.length}]\n${taskList}`);
    }

    // Active jobs summary
    const jobs = await this.loadJobs();
    const activeJobs = jobs.filter((j) => j.active);
    if (activeJobs.length > 0) {
      const jobList = activeJobs
        .map((j) => `- "${j.name}" (${j.cron}): ${j.prompt}`)
        .join("\n");
      parts.push(`[Active Reminders: ${activeJobs.length}]\n${jobList}`);
    }

    return parts.join("\n\n");
  }

  private async loadTasks(): Promise<Task[]> {
    try {
      const raw = await fs.readFile(path.join(this.dataDir, "tasks.json"), "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
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
}
