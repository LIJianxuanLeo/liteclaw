import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";
import type { Server } from "http";
import type { Agent } from "../core/agent.js";
import type { IncomingMessage, WSEvent } from "../core/types.js";
import type { LLMMessage } from "../core/llm.js";
import { log } from "../utils/logger.js";

// Per-connection conversation state
const sessions = new Map<WebSocket, { conversationId: string; history: LLMMessage[] }>();

export function attachWebSocket(server: Server, agent: Agent) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    const convId = randomUUID();
    sessions.set(ws, { conversationId: convId, history: [] });
    log.info("WebSocket connected", { conversationId: convId });

    // Send initial state
    send(ws, { type: "status", state: "idle" });

    ws.on("message", async (data) => {
      const session = sessions.get(ws);
      if (!session) return;

      let parsed: { text?: string; conversationId?: string };
      try {
        parsed = JSON.parse(data.toString());
      } catch {
        send(ws, { type: "error", message: "Invalid JSON" });
        return;
      }

      if (!parsed.text) {
        send(ws, { type: "error", message: "text field required" });
        return;
      }

      // Allow switching conversations
      if (parsed.conversationId && parsed.conversationId !== session.conversationId) {
        session.conversationId = parsed.conversationId;
        session.history = [];
      }

      const msg: IncomingMessage = {
        id: randomUUID(),
        conversationId: session.conversationId,
        channel: "web",
        userId: "web-user",
        text: parsed.text,
        timestamp: Date.now(),
      };

      try {
        await agent.processMessage(msg, session.history, (event) => {
          send(ws, event);
        });
      } catch (err) {
        log.error("WebSocket agent error", err);
        send(ws, { type: "error", message: "Agent processing failed" });
      }
    });

    ws.on("close", () => {
      sessions.delete(ws);
      log.info("WebSocket disconnected");
    });
  });

  return wss;
}

function send(ws: WebSocket, event: WSEvent) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
}
