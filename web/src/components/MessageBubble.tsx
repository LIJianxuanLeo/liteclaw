import ReactMarkdown from "react-markdown";
import { ToolCallCard } from "./ToolCallCard";
import type { ChatMessage } from "../hooks/useChat";

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-label">
        {message.role === "user" ? "You" : "LiteClaw"}
      </div>
      <div className="message-content">
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="tool-calls">
            {message.toolCalls.map((tc, i) => (
              <ToolCallCard key={i} toolCall={tc} />
            ))}
          </div>
        )}
        <div className="message-text">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
