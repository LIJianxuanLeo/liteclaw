import type { AgentState } from "../hooks/useChat";

interface Props {
  state: AgentState;
  connected: boolean;
}

const STATE_LABELS: Record<AgentState, string> = {
  idle: "Ready",
  thinking: "Thinking...",
  tool_execution: "Running tool...",
  responding: "Responding...",
};

export function StatusBar({ state, connected }: Props) {
  return (
    <div className="status-bar">
      <span className={`status-dot ${connected ? "connected" : "disconnected"}`} />
      <span className="status-text">
        {connected ? STATE_LABELS[state] : "Disconnected"}
      </span>
    </div>
  );
}
