export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'sending' | 'streaming' | 'complete' | 'stopped' | 'error';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: number;
  error?: string;
  liked?: boolean | null;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type ModelId = 'aether-demo' | 'aether-fast' | 'aether-think';

export interface AppSettings {
  model: ModelId;
  sidebarCollapsed: boolean;
}
