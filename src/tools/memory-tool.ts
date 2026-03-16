import { z } from "zod";
import { Tool } from "./_base.js";
import type { MemoryManager } from "../memory/memory-manager.js";

export class MemoryTool extends Tool {
  name = "memory";
  description =
    "Store and recall information from persistent memory. Use 'store' to save important facts, 'recall' to search memories, 'list_conversations' to see past conversations.";
  inputSchema = z.object({
    operation: z.enum(["store", "recall", "list_conversations"]).describe("Memory operation to perform"),
    content: z.string().optional().describe("Content to store (for 'store' operation)"),
    query: z.string().optional().describe("Search query (for 'recall' operation)"),
    tags: z.array(z.string()).optional().describe("Tags for the memory entry (for 'store' operation)"),
  });

  private memoryManager: MemoryManager;

  constructor(memoryManager: MemoryManager) {
    super();
    this.memoryManager = memoryManager;
  }

  async execute(input: Record<string, unknown>) {
    const { operation, content, query, tags } = this.inputSchema.parse(input);

    switch (operation) {
      case "store": {
        if (!content) return { success: false, output: "", error: "Content required for store" };
        const entry = await this.memoryManager.storeFact(content, tags ?? []);
        return { success: true, output: `Stored memory with id: ${entry.id}` };
      }
      case "recall": {
        if (!query) return { success: false, output: "", error: "Query required for recall" };
        const results = await this.memoryManager.recall(query);
        if (results.length === 0) return { success: true, output: "No memories found matching your query." };
        const formatted = results
          .map((r) => `[${r.tags.join(", ") || "no tags"}] ${r.content}`)
          .join("\n---\n");
        return { success: true, output: formatted };
      }
      case "list_conversations": {
        const convs = await this.memoryManager.listConversations();
        if (convs.length === 0) return { success: true, output: "No past conversations found." };
        const formatted = convs
          .map((c) => `- ${c.title} (${new Date(c.updatedAt).toLocaleDateString()})`)
          .join("\n");
        return { success: true, output: formatted };
      }
      default:
        return { success: false, output: "", error: `Unknown operation: ${operation}` };
    }
  }
}
