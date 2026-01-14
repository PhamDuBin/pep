// =============================================================================
// CHAT MESSAGE MODEL
// =============================================================================

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: "user" | "ai";
  highlightedText?: string;
  isNew?: boolean;
}
