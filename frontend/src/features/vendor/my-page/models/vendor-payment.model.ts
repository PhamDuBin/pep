// =============================================================================
// VENDOR PAYMENT MODELS
// =============================================================================

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
