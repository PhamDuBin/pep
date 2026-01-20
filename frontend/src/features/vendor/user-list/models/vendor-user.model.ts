// =============================================================================
// VENDOR USER MODEL
// =============================================================================

// Re-export from shared types (single source of truth)
export type { VendorUser } from "../../shared/models";

// PermissionOption is specific to user-list feature
export interface PermissionOption {
  value: string;
  label: string;
}
