import { useState } from "react";
import type { ToolCallInfo } from "../hooks/useChat";

interface Props {
  toolCall: ToolCallInfo;
}

export function ToolCallCard({ toolCall }: Props) {
  const [expanded, setExpanded] = useState(false);

  const statusIcon =
    toolCall.output === undefined ? "..." : toolCall.success ? "OK" : "ERR";
  const statusClass =
    toolCall.output === undefined
      ? "pending"
      : toolCall.success
        ? "success"
        : "error";

  return (
    <div className={`tool-card ${statusClass}`}>
      <div className="tool-header" onClick={() => setExpanded(!expanded)}>
        <span className="tool-icon">{expanded ? "v" : ">"}</span>
        <span className="tool-name">{toolCall.name}</span>
        <span className={`tool-status ${statusClass}`}>{statusIcon}</span>
      </div>
      {expanded && (
        <div className="tool-body">
          <div className="tool-section">
            <strong>Input:</strong>
            <pre>{JSON.stringify(toolCall.input, null, 2)}</pre>
          </div>
          {toolCall.output !== undefined && (
            <div className="tool-section">
              <strong>Output:</strong>
              <pre>{toolCall.output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
