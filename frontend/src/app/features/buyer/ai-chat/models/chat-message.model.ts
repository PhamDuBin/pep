// Import and re-export ChatMessage from shared models
import type { ChatMessage } from '../../shared/models/chat.model';
export type { ChatMessage } from '../../shared/models/chat.model';

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
