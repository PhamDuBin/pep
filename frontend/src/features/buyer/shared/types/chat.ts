// Chat related types
// Note: ChatMessage type is renamed to ChatMessageData to avoid conflict with ChatMessage component

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

export type DownloadFormat = "pdf" | "ppt";

export interface Vendor {
  id: string;
  name: string;
  isSelected: boolean;
}

export type ChatMode = "kick" | "free" | "project-plan";

export interface ChatModeOption {
  id: ChatMode;
  label: string;
  description?: string;
}
