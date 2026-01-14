// =============================================================================
// PAYMENT HISTORY MODEL
// =============================================================================

import { PaymentStatus } from "../types";

export interface PaymentHistoryRecord {
  id: string;
  paymentDate: string;
  amount: number;
  usagePeriod: string;
  status: PaymentStatus;
}
