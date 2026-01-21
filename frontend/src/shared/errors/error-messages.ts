/**
 * Centralized error messages for the application
 * All user-facing error messages should be defined here for consistency and easy maintenance
 */

// =============================================================================
// EMAIL VALIDATION ERRORS
// =============================================================================

export const EMAIL_ERRORS = {
  INVALID_FORMAT: "正しいメールアドレス形式で入力してください",
  ALREADY_INVITED: "このメールアドレスは既に招待されています",
  DUPLICATE_INPUT: "このメールアドレスは既に入力されています",
} as const;

// =============================================================================
// PASSWORD ERRORS
// =============================================================================

export const PASSWORD_ERRORS = {
  MISMATCH: "パスワードが一致しません",
} as const;

// =============================================================================
// GENERAL ERRORS
// =============================================================================

export const GENERAL_ERRORS = {
  CHANGE_FAILED: "変更に失敗しました",
} as const;
