// =============================================================================
// USER ACTION MODELS
// =============================================================================

import { UserPermission } from "../types";

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

export interface PermissionChangeModalState {
  userId: string | null;
  userName: string;
  currentPermission: UserPermission | null;
  newPermission: UserPermission | null;
}
