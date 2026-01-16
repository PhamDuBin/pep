// =============================================================================
// USER MODEL
// =============================================================================

import { UserPermission } from "../types/types";

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
