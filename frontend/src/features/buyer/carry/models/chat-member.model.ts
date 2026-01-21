// =============================================================================
// CHAT MEMBER MODEL
// =============================================================================

export interface ChatMember {
  id: string;
  name: string;
  initials: string;
}

export interface SearchableUser {
  id: string;
  name: string;
  email: string;
  initials: string;
}
