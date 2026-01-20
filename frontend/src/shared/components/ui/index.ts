// =============================================================================
// UI COMPONENTS INDEX
// =============================================================================
// Central export for shared UI components.
// Note: Feature-specific components have been moved to their respective features.

// Modal (used by multiple features)
export { Modal } from "./Modal";
export type { ModalProps, ModalSize } from "./Modal";
export { EmailChangeModal } from "./Modal";
export { AvatarChangeModal } from "./Modal";
export { InviteMemberModal } from "./Modal";
export { DeleteConfirmModal } from "./Modal";
// Note: InfoModal moved to vendor/shared/components (only used by vendor)

// Loading (used by multiple features)
export { Loading } from "./Loading";
export type { LoadingProps } from "./Loading";

// PageTransition
export { PageTransition } from "../layout/PageTransition";

// =============================================================================
// RE-EXPORTS FOR BACKWARD COMPATIBILITY
// =============================================================================
// These components have been moved to features/buyer but are re-exported here
// for backward compatibility. Consider updating imports directly to the feature.

export { TabNavigation } from "@/features/buyer/shared/components";
export { Pagination } from "../layout/Pagination";
export { ChatInput } from "@/features/buyer/shared/components";
export { ChatInputBox } from "@/features/buyer/shared/components";
export { ChatMessage } from "@/features/buyer/shared/components";
export { ChatMessageList } from "@/features/buyer/shared/components";
export { ProjectPlanModeButton } from "@/features/buyer/shared/components";
export {
  AnimatedList,
  AnimatedListItem,
} from "@/features/buyer/archive/components";
export { AnimatedDropdown } from "@/features/buyer/archive/components";
