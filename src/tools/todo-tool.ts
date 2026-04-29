import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Tool } from "./_base.js";
import type { Task } from "../core/types.js";

/**
 * Todo tool — manages a simple task list stored in tasks.json.
 */
export class TodoTool extends Tool {
  name = "todo";
  description =
    "Manage tasks. Operations: " +
    "add_task (args: operation='add_task', text=string [required], priority='high'|'medium'|'low' [optional, default medium]); " +
    "list_tasks (args: operation='list_tasks', filter='all'|'pending'|'done' [optional, default pending]); " +
    "complete_task (args: operation='complete_task', id=string [required, copy from previous add/list response]).";
  inputSchema = z.object({
    operation: z.enum(["add_task", "list_tasks", "complete_task"]),
    text: z.string().optional().describe("Task description"),
    priority: z.enum(["high", "medium", "low"]).optional().default("medium"),
    id: z.string().optional().describe("Task ID for complete"),
    filter: z.enum(["all", "pending", "done"]).optional().default("pending"),
  });

  private tasksFile: string;

  constructor(dataDir: string) {
    super();
    this.tasksFile = path.join(dataDir, "tasks.json");
  }

  private async loadTasks(): Promise<Task[]> {
    try {
      const raw = await fs.readFile(this.tasksFile, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await fs.writeFile(this.tasksFile, JSON.stringify(tasks, null, 2), "utf-8");
  }

  async execute(input: Record<string, unknown>) {
    const parsed = this.inputSchema.parse(input);

    try {
      switch (parsed.operation) {
        case "add_task": {
          if (!parsed.text) return { success: false, output: "", error: "text is required" };
          const tasks = await this.loadTasks();
          const task: Task = {
            id: randomUUID().substring(0, 8),
            text: parsed.text,
            priority: parsed.priority ?? "medium",
            done: false,
            createdAt: new Date().toISOString(),
          };
          tasks.push(task);
          await this.saveTasks(tasks);
          return { success: true, output: `Task added: "${task.text}" (ID: ${task.id}, priority: ${task.priority})` };
        }

        case "list_tasks": {
          const tasks = await this.loadTasks();
          let filtered = tasks;
          if (parsed.filter === "pending") filtered = tasks.filter((t) => !t.done);
          else if (parsed.filter === "done") filtered = tasks.filter((t) => t.done);

          if (filtered.length === 0) return { success: true, output: `No ${parsed.filter} tasks.` };

          const list = filtered
            .map((t) => `[${t.done ? "DONE" : t.priority.toUpperCase()}] ${t.id}: ${t.text}`)
            .join("\n");
          return { success: true, output: `${filtered.length} task(s):\n${list}` };
        }

        case "complete_task": {
          if (!parsed.id) return { success: false, output: "", error: "id is required" };
          const tasks = await this.loadTasks();
          const task = tasks.find((t) => t.id === parsed.id);
          if (!task) return { success: false, output: "", error: `Task ${parsed.id} not found` };
          task.done = true;
          task.completedAt = new Date().toISOString();
          await this.saveTasks(tasks);
          return { success: true, output: `Task "${task.text}" marked as done.` };
        }

        default:
          return { success: false, output: "", error: `Unknown operation: ${parsed.operation}` };
      }
    } catch (err) {
      return { success: false, output: "", error: err instanceof Error ? err.message : String(err) };
    }
  }
}
