// =============================================================================
// VENDOR MODELS
// =============================================================================

export interface Company {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface Message {
  id: string;
  companyId: string;
  companyName: string;
  projectName: string;
  preview: string;
  timestamp: string;
  unreadCount: number;
  isSelected: boolean;
}

export interface ThreadMessage {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
}

export interface MessageThread {
  id: string;
  messageId: string;
  messages: ThreadMessage[];
}

export interface User {
  id: string;
  name: string;
  initials: string;
  email?: string;
  avatarColor: string;
  avatarUrl?: string;
  role?: string;
  selected?: boolean;
}

export interface PaymentMethod {
  type: string;
  lastFourDigits: string;
}

export interface PaymentInfo {
  nextPaymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface PaymentHistory {
  id: string;
  paymentDate: string;
  amount: number;
  billingPeriod: string;
  status: string;
  invoiceUrl: string;
}
