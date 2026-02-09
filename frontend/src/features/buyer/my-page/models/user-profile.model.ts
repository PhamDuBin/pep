// =============================================================================
// USER PROFILE MODEL
// =============================================================================

import { UserRole } from "../types";
import { SubscriptionPlan } from "../../../../shared/types/subcription";

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  email: string;
  avatarColor: string;
  role: UserRole;
  subscriptionPlan?: SubscriptionPlan;
  trialEndDate?: string; // ISO date string for trial users
}

export interface AvatarColorOption {
  id: string;
  color: string;
  borderColor: string;
  isSelected: boolean;
}
