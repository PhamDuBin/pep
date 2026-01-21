// =============================================================================
// VENDOR CHAT MESSAGE MODEL
// =============================================================================

export interface VendorChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: "buyer" | "vendor";
  senderName: string;
  avatarUrl?: string;
}
