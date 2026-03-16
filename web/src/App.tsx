import { ChatWindow } from "./components/ChatWindow";
import { useChat } from "./hooks/useChat";
import "./App.css";

function App() {
  const {
    messages,
    agentState,
    connected,
    pendingToolCalls,
    streamingText,
    sendMessage,
    clearMessages,
  } = useChat();

  return (
    <div className="app">
      <ChatWindow
        messages={messages}
        agentState={agentState}
        connected={connected}
        pendingToolCalls={pendingToolCalls}
        streamingText={streamingText}
        onSendMessage={sendMessage}
        onNewChat={clearMessages}
      />
    </div>
  );
}

export default App;
