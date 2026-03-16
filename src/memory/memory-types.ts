export interface MemoryEntry {
  id: string;
  type: "fact" | "conversation";
  tags: string[];
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface ConversationLog {
  id: string;
  title: string;
  turns: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
  createdAt: number;
  updatedAt: number;
}
