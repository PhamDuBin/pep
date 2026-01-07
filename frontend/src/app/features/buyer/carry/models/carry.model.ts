/**
 * Represents a vendor in the message list
 */
export interface VendorContact {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isSelected?: boolean;
}

/**
 * Represents a message in vendor chat
 */
export interface VendorChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'buyer' | 'vendor';
  senderName: string;
  avatarUrl?: string;
}

/**
 * Represents a conversation with a vendor
 */
export interface VendorConversation {
  vendorId: string;
  vendorName: string;
  memberCount: number;
  messages: VendorChatMessage[];
}

/**
 * API Response for vendor list
 */
export interface VendorListResponse {
  vendors: VendorContact[];
  projectName: string;
}

/**
 * API Response for conversation
 */
export interface ConversationResponse {
  vendorId: string;
  vendorName: string;
  memberCount: number;
  messages: VendorChatMessage[];
}

/**
 * Send message request
 */
export interface SendMessageRequest {
  vendorId: string;
  content: string;
}

/**
 * Send message response
 */
export interface SendMessageResponse {
  success: boolean;
  message: VendorChatMessage;
}
