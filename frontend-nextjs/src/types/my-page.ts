// My Page related types

export type UserRole = "admin" | "member";

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

export type PaymentMethodType = "visa" | "mastercard" | "jcb" | "amex";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  lastFourDigits: string;
  expiryDate?: string;
}

export interface PaymentInfo {
  nextBillingDate: string;
  billingAmount: number;
  taxIncluded: boolean;
  paymentMethod: PaymentMethod | null;
}

export type PaymentStatus = "paid" | "pending" | "failed";

export interface PaymentHistoryRecord {
  id: string;
  paymentDate: string;
  amount: number;
  usagePeriod: string;
  status: PaymentStatus;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailChangeData {
  newEmail: string;
  confirmEmail: string;
}

export type MyPageModalType = "email-change" | "email-sent" | "avatar-change" | null;

export interface UserProfileResponse {
  user: UserProfile;
  success: boolean;
  message?: string;
}

export interface PaymentInfoResponse {
  paymentInfo: PaymentInfo;
  success: boolean;
  message?: string;
}

export interface PaymentHistoryResponse {
  records: PaymentHistoryRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ActionResponse {
  success: boolean;
  message?: string;
}
