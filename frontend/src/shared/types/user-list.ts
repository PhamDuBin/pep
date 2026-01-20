// =============================================================================
// USER LIST SHARED TYPES
// =============================================================================

/**
 * User data for displaying in user list table
 */
export interface UserListItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  avatarUrl?: string;
  permission: string;
  isSelected: boolean;
}

/**
 * Permission option for permission dropdown/select
 */
export interface PermissionOption {
  value: string;
  label: string;
}
