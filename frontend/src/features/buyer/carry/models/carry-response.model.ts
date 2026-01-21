// =============================================================================
// CARRY RESPONSE MODELS
// =============================================================================

import { VendorContact } from "./vendor-contact.model";
import { VendorChatMessage } from "./vendor-chat-message.model";
import { ChatMember } from "./chat-member.model";

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

export interface AddMemberRequest {
  vendorId: string;
  memberIds: string[];
}

export interface AddMemberResponse {
  success: boolean;
  members: ChatMember[];
}
