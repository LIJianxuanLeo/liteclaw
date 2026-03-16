import fs from "fs/promises";
import path from "path";
import type { SkillDefinition } from "./skill-types.js";
import { log } from "../utils/logger.js";

export class SkillLoader {
  private skillsDir: string;
  private skills = new Map<string, SkillDefinition>();

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir;
  }

  async loadAll(): Promise<void> {
    try {
      const files = await fs.readdir(this.skillsDir);
      for (const file of files) {
        if (!file.endsWith(".md") || file.startsWith("_")) continue;
        const content = await fs.readFile(path.join(this.skillsDir, file), "utf-8");
        const skill = this.parseSkill(content);
        if (skill) {
          this.skills.set(skill.name, skill);
          log.info(`Loaded skill: ${skill.name}`);
        }
      }
    } catch {
      log.warn("Skills directory not found or empty");
    }
  }

  private parseSkill(raw: string): SkillDefinition | null {
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) return null;

    const frontmatter = fmMatch[1];
    const body = fmMatch[2].trim();

    const nameMatch = frontmatter.match(/name:\s*(.+)/);
    const descMatch = frontmatter.match(/description:\s*(.+)/);
    const triggersMatch = frontmatter.match(/triggers:\s*\[([^\]]*)\]/);
    const toolsMatch = frontmatter.match(/tools:\s*\[([^\]]*)\]/);

    if (!nameMatch) return null;

    return {
      name: nameMatch[1].trim(),
      description: descMatch?.[1]?.trim() ?? "",
      triggers: triggersMatch
        ? triggersMatch[1].split(",").map((t) => t.trim().replace(/"/g, "")).filter(Boolean)
        : [],
      tools: toolsMatch
        ? toolsMatch[1].split(",").map((t) => t.trim().replace(/"/g, "")).filter(Boolean)
        : [],
      instructions: body,
    };
  }

  getAll(): SkillDefinition[] {
    return Array.from(this.skills.values());
  }

  findMatching(text: string): SkillDefinition[] {
    const lower = text.toLowerCase();
    return this.getAll().filter((s) =>
      s.triggers.some((t) => lower.includes(t.toLowerCase()))
    );
  }
}
