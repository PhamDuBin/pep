export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'ai';
  highlightedText?: string;
  isNew?: boolean; // Flag to indicate if this is a newly added message (for animation)
}

export interface ChatConversation {
  id: string;
  projectId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageRequest {
  conversationId?: string;
  projectId: string;
  content: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: ChatMessage;
  conversationId: string;
}

export interface GetConversationRequest {
  projectId: string;
  conversationId?: string;
}

export interface GetConversationResponse {
  success: boolean;
  conversation: ChatConversation;
}
