// =============================================================================
// MY PAGE TYPES
// =============================================================================

// Type aliases
export type UserRole = "admin" | "member";
export type PaymentMethodType = "visa" | "mastercard" | "jcb" | "amex";
export type PaymentStatus = "paid" | "pending" | "failed";
export type MyPageModalType = "email-change" | "email-sent" | "avatar-change" | null;

// Re-export models
export * from "../models";
