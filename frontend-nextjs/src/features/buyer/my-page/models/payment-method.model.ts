// =============================================================================
// PAYMENT METHOD MODEL
// =============================================================================

import { PaymentMethodType } from "../types";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  lastFourDigits: string;
  expiryDate?: string;
}
