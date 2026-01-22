// =============================================================================
// USER PROFILE MODEL
// =============================================================================

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  email: string;
  avatarColor: string;
  avatarUrl?: string;
}
