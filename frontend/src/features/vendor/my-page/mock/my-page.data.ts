// =============================================================================
// MY PAGE MOCK DATA
// =============================================================================

import {
  UserProfile,
  PaymentInfo,
  PaymentHistory,
} from "../models";

export const USER_PROFILE_MOCK: UserProfile = {
  id: "1",
  name: "山口 太郎",
  initials: "山口",
  email: "yamaguchi@example.com",
  avatarColor: "#8EC5D0",
  avatarUrl: undefined,
};

export const PAYMENT_INFO_MOCK: PaymentInfo = {
  nextPaymentDate: "2024年12月15日",
  amount: 30000,
  paymentMethod: {
    type: "visa",
    lastFourDigits: "4242",
  },
};

export const PAYMENT_HISTORY_MOCK: PaymentHistory[] = [
  {
    id: "p1",
    paymentDate: "2024/11/15",
    amount: 30000,
    billingPeriod: "2024年11月",
    status: "支払済",
    invoiceUrl: "#",
  },
  {
    id: "p2",
    paymentDate: "2024/10/15",
    amount: 30000,
    billingPeriod: "2024年10月",
    status: "支払済",
    invoiceUrl: "#",
  },
  {
    id: "p3",
    paymentDate: "2024/09/15",
    amount: 30000,
    billingPeriod: "2024年9月",
    status: "支払済",
    invoiceUrl: "#",
  },
];
