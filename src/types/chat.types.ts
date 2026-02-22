export interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
  role: string;
  message: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface SendChatMessagePayload {
  chat_group_id: string | null;
  isNewChat: boolean;
  message: string;
}

export interface SendChatMessage {
  chat_group_id: string;
  chat_language: string;
  user_message: {
    id: string;
    chat_group_id: string;
    role: string;
    message: string;
    created_at: string;
  };
  assistant_message: {
    id: string;
    chat_group_id: string;
    role: string;
    message: string;
    created_at: string;
  };
}

export interface ChatMessageItem {
  role: "user" | "assistant";
  message: string;
}

export interface ChatDetails {
  title: string;
  chat_group_id: string;
  messages: Array<ChatMessageItem>;
}

export interface ChatHistoryItem {
  id: string;
  chat_group_id: string;
  title: string;
  chat_language: string;
  created_at: string;
  updated_at: string;
}
