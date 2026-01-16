// =============================================================================
// VENDOR MODELS
// =============================================================================

export interface VendorCompany {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface VendorMessage {
  id: string;
  companyId: string;
  companyName: string;
  projectName: string;
  preview: string;
  timestamp: string;
  unreadCount: number;
  isSelected: boolean;
}

export interface VendorThreadMessage {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
}

export interface VendorMessageThread {
  id: string;
  messageId: string;
  messages: VendorThreadMessage[];
}

export interface VendorUser {
  id: string;
  name: string;
  initials: string;
  email?: string;
  avatarColor: string;
  avatarUrl?: string;
  role?: string;
  selected?: boolean;
}

export interface VendorPaymentMethod {
  type: string;
  lastFourDigits: string;
}

export interface VendorPaymentInfo {
  nextPaymentDate: string;
  amount: number;
  paymentMethod: VendorPaymentMethod;
}

export interface VendorPaymentHistory {
  id: string;
  paymentDate: string;
  amount: number;
  billingPeriod: string;
  status: string;
  invoiceUrl: string;
}
