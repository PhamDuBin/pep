// Carry (Vendor Chat) related types

export interface VendorContact {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isSelected?: boolean;
}

export interface VendorChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: "buyer" | "vendor";
  senderName: string;
  avatarUrl?: string;
}

export interface VendorConversation {
  vendorId: string;
  vendorName: string;
  memberCount: number;
  messages: VendorChatMessage[];
}

export interface VendorListResponse {
  vendors: VendorContact[];
  projectName: string;
}

export interface ConversationResponse {
  vendorId: string;
  vendorName: string;
  memberCount: number;
  messages: VendorChatMessage[];
}

export interface SendMessageRequest {
  vendorId: string;
  content: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: VendorChatMessage;
}

export interface ChatMember {
  id: string;
  name: string;
  initials: string;
}

export interface SearchableUser {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface AddMemberRequest {
  vendorId: string;
  memberIds: string[];
}

export interface AddMemberResponse {
  success: boolean;
  members: ChatMember[];
}
