// =============================================================================
// TYPES INDEX
// =============================================================================
// Central export for shared type definitions.
// Feature-specific types have been moved to their respective features.

export * from "./api";
export * from "./project";
export * from "./avatar-color-option";
export * from "./tab";
export * from "./modal";
export * from "./loading";
// =============================================================================
// RE-EXPORTS FOR BACKWARD COMPATIBILITY
// =============================================================================
// Chat types - re-export with explicit alias to avoid conflict with ChatMessage component

export type {
  ChatMessageData,
  PdfPage,
  Vendor,
  ChatMode,
  ChatModeOption,
} from "@/features/buyer/shared/types/chat";

// Backward compatibility - ChatMessage type alias
export type { ChatMessageData as ChatMessage } from "@/features/buyer/shared/types/chat";
