/**
 * User permission type
 */
export type UserPermission = 'admin' | 'member';

/**
 * User information in the user list
 */
export interface User {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  permission: UserPermission;
  email?: string;
  isSelected?: boolean;
}

/**
 * Permission option for dropdown/selection
 */
export interface PermissionOption {
  value: UserPermission;
  label: string;
}

/**
 * Modal type for user-list
 */
export type UserListModalType =
  | 'permission-change'
  | 'permission-change-complete'
  | 'delete-confirm'
  | 'delete-complete'
  | 'invite-member'
  | null;

/**
 * Permission change data
 */
export interface PermissionChangeData {
  userId: string;
  newPermission: UserPermission;
}

/**
 * Delete users data
 */
export interface DeleteUsersData {
  userIds: string[];
}

/**
 * API Response for user list
 */
export interface UserListResponse {
  users: User[];
  totalCount: number;
  success: boolean;
  message?: string;
}

/**
 * API Response for generic actions
 */
export interface UserActionResponse {
  success: boolean;
  message?: string;
}

/**
 * Permission change modal state
 */
export interface PermissionChangeModalState {
  userId: string | null;
  userName: string;
  currentPermission: UserPermission | null;
  newPermission: UserPermission | null;
}
