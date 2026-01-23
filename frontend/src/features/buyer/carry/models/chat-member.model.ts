// =============================================================================
// CHAT MEMBER MODEL
// =============================================================================

import { OrganizationType } from "../types";

export interface ChatMember {
  id: string;
  name: string;
  initials: string;
  organization: OrganizationType;
}

export interface SearchableUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  organization: OrganizationType;
}
