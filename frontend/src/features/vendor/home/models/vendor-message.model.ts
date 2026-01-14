// =============================================================================
// VENDOR MESSAGE MODEL
// =============================================================================

export interface VendorMessage {
  id: string;
  companyId: string;
  companyName: string;
  projectName: string;
  preview: string;
  timestamp: string;
  unreadCount: number;
  isSelected: boolean;
}

export interface VendorThreadMessage {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
}

export interface VendorMessageThread {
  id: string;
  messageId: string;
  messages: VendorThreadMessage[];
}
