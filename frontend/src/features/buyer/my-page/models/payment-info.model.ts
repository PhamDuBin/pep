// =============================================================================
// PAYMENT INFO MODEL
// =============================================================================

import { PaymentMethod } from "./payment-method.model";

export interface PaymentInfo {
  nextBillingDate: string;
  billingAmount: number;
  taxIncluded: boolean;
  paymentMethod: PaymentMethod | null;
}
