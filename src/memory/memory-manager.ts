import fs from "fs/promises";
import path from "path";
import { log } from "../utils/logger.js";

const MAX_CONVERSATION_ENTRIES = 40; // Auto-trim beyond this

export class MemoryManager {
  private dataDir: string;
  private memoryFile: string;
  private conversationFile: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.memoryFile = path.join(dataDir, "memory.md");
    this.conversationFile = path.join(dataDir, "conversations.md");
  }

  async init(): Promise<void> {
    await fs.mkdir(this.dataDir, { recursive: true });

    // Create files if they don't exist
    for (const file of [this.memoryFile, this.conversationFile]) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, "", "utf-8");
        log.info(`Created ${path.basename(file)}`);
      }
    }
    log.info("Memory initialized", { dataDir: this.dataDir });
  }

  // --- Long-term Memory (memory.md) ---

  async loadMemory(): Promise<string> {
    try {
      return await fs.readFile(this.memoryFile, "utf-8");
    } catch {
      return "";
    }
  }

  async appendMemory(fact: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const entry = `\n- [${timestamp}] ${fact}\n`;
    await fs.appendFile(this.memoryFile, entry, "utf-8");
    log.debug("Memory fact stored", { fact: fact.substring(0, 50) });
  }

  // --- Short-term Conversation (conversations.md) ---

  async loadRecentConversation(n: number = 20): Promise<string> {
    try {
      const raw = await fs.readFile(this.conversationFile, "utf-8");
      const lines = raw.trim().split("\n");
      // Each entry is 2 lines: "## Role\ncontent", take last n*2 lines
      const entries = [];
      let current = "";
      for (const line of lines) {
        if (line.startsWith("## ") && current) {
          entries.push(current.trim());
          current = line + "\n";
        } else {
          current += line + "\n";
        }
      }
      if (current.trim()) entries.push(current.trim());

      return entries.slice(-n).join("\n\n");
    } catch {
      return "";
    }
  }

  async appendConversation(role: "User" | "Assistant", text: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const entry = `## ${role} [${timestamp}]\n${text}\n\n`;
    await fs.appendFile(this.conversationFile, entry, "utf-8");

    // Auto-trim if too long
    await this.trimConversation();
  }

  private async trimConversation(): Promise<void> {
    try {
      const raw = await fs.readFile(this.conversationFile, "utf-8");
      const entries: string[] = [];
      let current = "";
      for (const line of raw.split("\n")) {
        if (line.startsWith("## ") && current) {
          entries.push(current);
          current = line + "\n";
        } else {
          current += line + "\n";
        }
      }
      if (current.trim()) entries.push(current);

      if (entries.length > MAX_CONVERSATION_ENTRIES) {
        const kept = entries.slice(-MAX_CONVERSATION_ENTRIES);
        await fs.writeFile(this.conversationFile, kept.join(""), "utf-8");
        log.info("Conversation trimmed", { removed: entries.length - kept.length });
      }
    } catch {
      // Ignore trim errors
    }
  }
}
