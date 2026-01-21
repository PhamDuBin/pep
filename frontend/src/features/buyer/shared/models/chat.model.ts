// =============================================================================
// CHAT MODELS
// =============================================================================

export interface ChatMessageData {
  id: string;
  content: string;
  timestamp: Date;
  sender: "user" | "ai";
  highlightedText?: string;
  isNew?: boolean;
}

export interface PdfPage {
  id: string;
  pageNumber: number;
  title: string;
  thumbnailUrl?: string;
}

export interface Vendor {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface ChatModeOption {
  id: "kick" | "free" | "project-plan";
  label: string;
  description?: string;
}
