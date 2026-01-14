/**
 * User role type
 */
export type UserRole = 'admin' | 'member';

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  email: string;
  avatarColor: string;
  role: UserRole;
}

/**
 * Avatar color option
 */
export interface AvatarColorOption {
  id: string;
  color: string;
  borderColor: string;
  isSelected: boolean;
}

/**
 * Payment method type
 */
export type PaymentMethodType = 'visa' | 'mastercard' | 'jcb' | 'amex';

/**
 * Payment method information
 */
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  lastFourDigits: string;
  expiryDate?: string;
}

/**
 * Payment information
 */
export interface PaymentInfo {
  nextBillingDate: string;
  billingAmount: number;
  taxIncluded: boolean;
  paymentMethod: PaymentMethod | null;
}

/**
 * Payment status type
 */
export type PaymentStatus = 'paid' | 'pending' | 'failed';

/**
 * Payment history record
 */
export interface PaymentHistoryRecord {
  id: string;
  paymentDate: string;
  amount: number;
  usagePeriod: string;
  status: PaymentStatus;
}

/**
 * Password change form data
 */
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Email change form data
 */
export interface EmailChangeData {
  newEmail: string;
  confirmEmail: string;
}

/**
 * Modal type for my-page
 */
export type MyPageModalType = 'email-change' | 'email-sent' | 'avatar-change' | null;

/**
 * API Response for user profile
 */
export interface UserProfileResponse {
  user: UserProfile;
  success: boolean;
  message?: string;
}

/**
 * API Response for payment info
 */
export interface PaymentInfoResponse {
  paymentInfo: PaymentInfo;
  success: boolean;
  message?: string;
}

/**
 * API Response for payment history
 */
export interface PaymentHistoryResponse {
  records: PaymentHistoryRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * API Response for generic actions
 */
export interface ActionResponse {
  success: boolean;
  message?: string;
}
