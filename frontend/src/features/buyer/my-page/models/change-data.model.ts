// =============================================================================
// CHANGE DATA MODELS
// =============================================================================

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailChangeData {
  newEmail: string;
  confirmEmail: string;
}
