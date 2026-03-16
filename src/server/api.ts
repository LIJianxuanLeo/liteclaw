import express from "express";
import path from "path";
import { randomUUID } from "crypto";
import type { Agent } from "../core/agent.js";
import type { MemoryManager } from "../memory/memory-manager.js";
import type { IncomingMessage } from "../core/types.js";
import type { LLMMessage } from "../core/llm.js";
import { log } from "../utils/logger.js";

// In-memory conversation storage for active sessions
const conversations = new Map<string, LLMMessage[]>();

export function createApp(agent: Agent, memoryManager: MemoryManager) {
  const app = express();
  app.use(express.json());

  // Serve static frontend files in production
  app.use(express.static(path.resolve("web/dist")));

  // CORS for dev
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (_req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", agentState: agent.getState() });
  });

  // Send a chat message (non-streaming, for simple use)
  app.post("/api/chat", async (req, res) => {
    const { text, conversationId } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });

    const convId = conversationId || randomUUID();
    if (!conversations.has(convId)) conversations.set(convId, []);
    const history = conversations.get(convId)!;

    const msg: IncomingMessage = {
      id: randomUUID(),
      conversationId: convId,
      channel: "web",
      userId: "web-user",
      text,
      timestamp: Date.now(),
    };

    try {
      const response = await agent.processMessage(msg, history);
      res.json({ ...response, conversationId: convId });
    } catch (err) {
      log.error("Chat error", err);
      res.status(500).json({ error: "Agent processing failed" });
    }
  });

  // List conversations from memory
  app.get("/api/conversations", async (_req, res) => {
    const convs = await memoryManager.listConversations();
    res.json(convs);
  });

  // Get a conversation
  app.get("/api/conversations/:id", async (req, res) => {
    const conv = await memoryManager.getConversation(req.params.id);
    if (!conv) return res.status(404).json({ error: "Not found" });
    res.json(conv);
  });

  // New conversation
  app.post("/api/conversations/new", (_req, res) => {
    const id = randomUUID();
    conversations.set(id, []);
    res.json({ conversationId: id });
  });

  // Fallback to SPA
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve("web/dist/index.html"));
  });

  return app;
}
