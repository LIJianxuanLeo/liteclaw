import { useState, useRef, useCallback, useEffect } from "react";

export type AgentState = "idle" | "thinking" | "tool_execution" | "responding";

export interface ToolCallInfo {
  name: string;
  input: Record<string, unknown>;
  output?: string;
  success?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  toolCalls?: ToolCallInfo[];
  timestamp: number;
}

interface WSEvent {
  type: string;
  state?: AgentState;
  detail?: string;
  name?: string;
  input?: Record<string, unknown>;
  output?: string;
  success?: boolean;
  text?: string;
  message?: {
    id: string;
    text: string;
    toolCalls?: ToolCallInfo[];
    timestamp: number;
  };
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [connected, setConnected] = useState(false);
  const [pendingToolCalls, setPendingToolCalls] = useState<ToolCallInfo[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 2s
      reconnectRef.current = setTimeout(connect, 2000);
    };

    ws.onmessage = (e) => {
      const event: WSEvent = JSON.parse(e.data);

      switch (event.type) {
        case "status":
          setAgentState(event.state ?? "idle");
          break;
        case "tool_call":
          setPendingToolCalls((prev) => [
            ...prev,
            { name: event.name!, input: event.input ?? {} },
          ]);
          break;
        case "tool_result":
          setPendingToolCalls((prev) =>
            prev.map((tc) =>
              tc.name === event.name && tc.output === undefined
                ? { ...tc, output: event.output, success: event.success }
                : tc
            )
          );
          break;
        case "text_delta":
          setStreamingText((prev) => prev + (event.text ?? ""));
          break;
        case "message_complete":
          if (event.message) {
            setMessages((prev) => [
              ...prev,
              {
                id: event.message!.id,
                role: "assistant",
                text: event.message!.text,
                toolCalls: event.message!.toolCalls,
                timestamp: event.message!.timestamp,
              },
            ]);
          }
          setStreamingText("");
          setPendingToolCalls([]);
          setAgentState("idle");
          break;
        case "error":
          setAgentState("idle");
          setStreamingText("");
          setPendingToolCalls([]);
          break;
      }
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setStreamingText("");
      setPendingToolCalls([]);

      wsRef.current.send(JSON.stringify({ text }));
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingText("");
    setPendingToolCalls([]);
  }, []);

  return {
    messages,
    agentState,
    connected,
    pendingToolCalls,
    streamingText,
    sendMessage,
    clearMessages,
  };
}
