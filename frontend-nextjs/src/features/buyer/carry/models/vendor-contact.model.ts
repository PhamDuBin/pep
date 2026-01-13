// =============================================================================
// VENDOR CONTACT MODEL
// =============================================================================

export interface VendorContact {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isSelected?: boolean;
}
