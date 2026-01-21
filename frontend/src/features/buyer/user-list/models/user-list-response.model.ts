// =============================================================================
// USER LIST RESPONSE MODELS
// =============================================================================

import { User } from "./user.model";

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
