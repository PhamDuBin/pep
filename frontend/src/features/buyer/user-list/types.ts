// =============================================================================
// USER LIST TYPES
// =============================================================================

export type UserPermission = "admin" | "member";

export interface User {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  permission: UserPermission;
  email?: string;
  isSelected?: boolean;
}

export interface PermissionOption {
  value: UserPermission;
  label: string;
}

export interface UserActionResponse {
  success: boolean;
  message?: string;
}

export interface UserListResponse {
  users: User[];
  totalCount: number;
  success: boolean;
  message?: string;
}
