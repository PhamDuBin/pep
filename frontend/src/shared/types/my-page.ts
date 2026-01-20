// =============================================================================
// MY PAGE SHARED TYPES
// =============================================================================

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  avatarColor?: string;
  avatarUrl?: string;
}

export interface PaymentMethod {
  type: string;
  lastFourDigits: string;
}

export interface PaymentInfo {
  nextBillingDate: string;
  billingAmount: number;
  taxIncluded?: boolean;
  paymentMethod?: PaymentMethod;
}

export interface PaymentHistoryRecord {
  id: string;
  paymentDate: string;
  amount: number;
  usagePeriod: string;
  status: string;
  invoiceUrl?: string;
}
