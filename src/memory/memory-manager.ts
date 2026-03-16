import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { MemoryEntry, ConversationLog } from "./memory-types.js";
import { log } from "../utils/logger.js";

export class MemoryManager {
  private baseDir: string;
  private factsDir: string;
  private convDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.factsDir = path.join(baseDir, "facts");
    this.convDir = path.join(baseDir, "conversations");
  }

  async init() {
    await fs.mkdir(this.factsDir, { recursive: true });
    await fs.mkdir(this.convDir, { recursive: true });
    log.info("Memory initialized", { baseDir: this.baseDir });
  }

  // --- Facts ---

  async storeFact(content: string, tags: string[] = []): Promise<MemoryEntry> {
    const entry: MemoryEntry = {
      id: randomUUID(),
      type: "fact",
      tags,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const frontmatter = `---\nid: ${entry.id}\ntags: [${tags.join(", ")}]\ncreatedAt: ${new Date(entry.createdAt).toISOString()}\n---\n\n`;
    await fs.writeFile(
      path.join(this.factsDir, `${entry.id}.md`),
      frontmatter + content,
      "utf-8"
    );

    log.debug("Stored fact", { id: entry.id, tags });
    return entry;
  }

  async recall(query: string): Promise<MemoryEntry[]> {
    const results: MemoryEntry[] = [];
    const queryLower = query.toLowerCase();

    try {
      const files = await fs.readdir(this.factsDir);
      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const content = await fs.readFile(path.join(this.factsDir, file), "utf-8");
        if (content.toLowerCase().includes(queryLower)) {
          const parsed = this.parseFact(file, content);
          if (parsed) results.push(parsed);
        }
      }
    } catch {
      // directory might not exist yet
    }

    return results;
  }

  private parseFact(filename: string, raw: string): MemoryEntry | null {
    const id = filename.replace(".md", "");
    // Extract content after frontmatter
    const parts = raw.split("---");
    const content = parts.length >= 3 ? parts.slice(2).join("---").trim() : raw;
    // Extract tags from frontmatter
    const tagsMatch = raw.match(/tags:\s*\[([^\]]*)\]/);
    const tags = tagsMatch ? tagsMatch[1].split(",").map((t) => t.trim()).filter(Boolean) : [];
    const dateMatch = raw.match(/createdAt:\s*(.+)/);
    const createdAt = dateMatch ? new Date(dateMatch[1]).getTime() : Date.now();

    return { id, type: "fact", tags, content, createdAt, updatedAt: createdAt };
  }

  // --- Conversations ---

  async saveConversation(conv: ConversationLog): Promise<void> {
    const frontmatter = `---\nid: ${conv.id}\ntitle: ${conv.title}\ncreatedAt: ${new Date(conv.createdAt).toISOString()}\nupdatedAt: ${new Date(conv.updatedAt).toISOString()}\n---\n\n`;

    const body = conv.turns
      .map((t) => `## ${t.role === "user" ? "User" : "Assistant"}\n\n${t.content}\n`)
      .join("\n");

    await fs.writeFile(
      path.join(this.convDir, `${conv.id}.md`),
      frontmatter + body,
      "utf-8"
    );
  }

  async listConversations(): Promise<Array<{ id: string; title: string; updatedAt: number }>> {
    const results: Array<{ id: string; title: string; updatedAt: number }> = [];

    try {
      const files = await fs.readdir(this.convDir);
      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const content = await fs.readFile(path.join(this.convDir, file), "utf-8");
        const titleMatch = content.match(/title:\s*(.+)/);
        const dateMatch = content.match(/updatedAt:\s*(.+)/);
        results.push({
          id: file.replace(".md", ""),
          title: titleMatch?.[1] ?? "Untitled",
          updatedAt: dateMatch ? new Date(dateMatch[1]).getTime() : 0,
        });
      }
    } catch {
      // directory might not exist yet
    }

    return results.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async getConversation(id: string): Promise<ConversationLog | null> {
    try {
      const content = await fs.readFile(path.join(this.convDir, `${id}.md`), "utf-8");
      const titleMatch = content.match(/title:\s*(.+)/);
      const createdMatch = content.match(/createdAt:\s*(.+)/);
      const updatedMatch = content.match(/updatedAt:\s*(.+)/);

      // Parse turns from markdown
      const turns: ConversationLog["turns"] = [];
      const sections = content.split(/^## (User|Assistant)\s*$/m);
      for (let i = 1; i < sections.length; i += 2) {
        const role = sections[i].toLowerCase() as "user" | "assistant";
        const text = sections[i + 1]?.trim() ?? "";
        turns.push({ role, content: text, timestamp: 0 });
      }

      return {
        id,
        title: titleMatch?.[1] ?? "Untitled",
        turns,
        createdAt: createdMatch ? new Date(createdMatch[1]).getTime() : 0,
        updatedAt: updatedMatch ? new Date(updatedMatch[1]).getTime() : 0,
      };
    } catch {
      return null;
    }
  }
}
