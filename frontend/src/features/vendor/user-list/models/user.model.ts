// =============================================================================
// USER MODEL
// =============================================================================

// Re-export from shared types (single source of truth)
export type { User } from "../../shared/models";

// PermissionOption is specific to user-list feature
export interface PermissionOption {
  value: string;
  label: string;
}
