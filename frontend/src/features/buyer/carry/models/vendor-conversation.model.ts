// =============================================================================
// VENDOR CONVERSATION MODEL
// =============================================================================

import { VendorChatMessage } from "./vendor-chat-message.model";

export interface VendorConversation {
  vendorId: string;
  vendorName: string;
  memberCount: number;
  messages: VendorChatMessage[];
}
