// =============================================================================
// USER PROFILE MODEL
// =============================================================================

import { UserRole } from "../types";

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  email: string;
  avatarColor: string;
  role: UserRole;
}

export interface AvatarColorOption {
  id: string;
  color: string;
  borderColor: string;
  isSelected: boolean;
}
