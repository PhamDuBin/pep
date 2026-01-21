// =============================================================================
// MY PAGE RESPONSE MODELS
// =============================================================================

import { UserProfile } from "./user-profile.model";
import { PaymentInfo } from "./payment-info.model";
import { PaymentHistoryRecord } from "./payment-history.model";

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
