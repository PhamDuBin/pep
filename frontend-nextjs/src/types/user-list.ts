// User List related types

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

export type UserListModalType =
  | "permission-change"
  | "permission-change-complete"
  | "delete-confirm"
  | "delete-complete"
  | "invite-member"
  | "invite-member-complete"
  | null;

export interface PermissionChangeData {
  userId: string;
  newPermission: UserPermission;
}

export interface DeleteUsersData {
  userIds: string[];
}

export interface InviteMembersData {
  emails: string[];
}

export interface UserListResponse {
  users: User[];
  totalCount: number;
  success: boolean;
  message?: string;
}

export interface UserActionResponse {
  success: boolean;
  message?: string;
}

export interface PermissionChangeModalState {
  userId: string | null;
  userName: string;
  currentPermission: UserPermission | null;
  newPermission: UserPermission | null;
}
