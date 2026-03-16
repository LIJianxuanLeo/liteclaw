import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ToolCallCard } from "./ToolCallCard";
import { StatusBar } from "./StatusBar";
import type { ChatMessage, ToolCallInfo, AgentState } from "../hooks/useChat";

interface Props {
  messages: ChatMessage[];
  agentState: AgentState;
  connected: boolean;
  pendingToolCalls: ToolCallInfo[];
  streamingText: string;
  onSendMessage: (text: string) => void;
  onNewChat: () => void;
}

export function ChatWindow({
  messages,
  agentState,
  connected,
  pendingToolCalls,
  streamingText,
  onSendMessage,
  onNewChat,
}: Props) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, pendingToolCalls]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || agentState !== "idle") return;
    onSendMessage(text);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isProcessing = agentState !== "idle";

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h1>LiteClaw</h1>
        <div className="chat-header-actions">
          <StatusBar state={agentState} connected={connected} />
          <button className="btn-new-chat" onClick={onNewChat}>
            New Chat
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <h2>Hello! I'm LiteClaw.</h2>
            <p>
              I can execute shell commands, read/write files, fetch web pages,
              and remember things across conversations.
            </p>
            <p>Try asking me something!</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Show live tool calls */}
        {pendingToolCalls.length > 0 && (
          <div className="message assistant">
            <div className="message-label">LiteClaw</div>
            <div className="message-content">
              <div className="tool-calls">
                {pendingToolCalls.map((tc, i) => (
                  <ToolCallCard key={i} toolCall={tc} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Show streaming text */}
        {streamingText && (
          <div className="message assistant streaming">
            <div className="message-label">LiteClaw</div>
            <div className="message-content">
              <div className="message-text">{streamingText}</div>
            </div>
          </div>
        )}

        {/* Thinking indicator */}
        {isProcessing && !streamingText && pendingToolCalls.length === 0 && (
          <div className="thinking-indicator">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isProcessing ? "Waiting for response..." : "Type a message..."}
          disabled={isProcessing}
          rows={1}
        />
        <button
          className="btn-send"
          onClick={handleSubmit}
          disabled={!input.trim() || isProcessing}
        >
          Send
        </button>
      </div>
    </div>
  );
}
