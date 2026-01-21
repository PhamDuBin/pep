// =============================================================================
// MY PAGE MOCK DATA
// =============================================================================

import {
  UserProfile,
  PaymentInfo,
  PaymentHistoryRecord,
  AvatarColorOption,
} from "../types";

export const ADMIN_USER_MOCK: UserProfile = {
  id: "user-admin-1",
  name: "田中　一郎",
  initials: "TY",
  email: "i-tanaka@a.co.jp",
  avatarColor: "#8ec5d0",
  role: "admin",
};

export const MEMBER_USER_MOCK: UserProfile = {
  id: "user-member-1",
  name: "東 次郎",
  initials: "TY",
  email: "z-azuma@b.co.jp",
  avatarColor: "#8ec5d0",
  role: "member",
};

export const PAYMENT_INFO_MOCK: PaymentInfo = {
  nextBillingDate: "2026年2月1日",
  billingAmount: 4334,
  taxIncluded: true,
  paymentMethod: {
    id: "pm-1",
    type: "visa",
    lastFourDigits: "1111",
    expiryDate: "12/28",
  },
};

export const PAYMENT_HISTORY_MOCK: PaymentHistoryRecord[] = [
  {
    id: "ph-1",
    paymentDate: "2026/01/01",
    amount: 3784,
    usagePeriod: "2026/01/01-2026/02/01",
    status: "paid",
  },
  {
    id: "ph-2",
    paymentDate: "2025/12/01",
    amount: 3784,
    usagePeriod: "2025/12/01-2026/01/01",
    status: "paid",
  },
  {
    id: "ph-3",
    paymentDate: "2025/11/01",
    amount: 3234,
    usagePeriod: "2025/11/01-2025/10/01",
    status: "paid",
  },
  {
    id: "ph-4",
    paymentDate: "2025/10/01",
    amount: 3234,
    usagePeriod: "2026/10/01-2026/11/01",
    status: "paid",
  },
];

export const AVATAR_COLOR_OPTIONS_MOCK: AvatarColorOption[] = [
  {
    id: "color-1",
    color: "#8ec5d0",
    borderColor: "#066a9e",
    isSelected: true,
  },
  {
    id: "color-2",
    color: "#e8b4d8",
    borderColor: "transparent",
    isSelected: false,
  },
  {
    id: "color-3",
    color: "#90d4a8",
    borderColor: "transparent",
    isSelected: false,
  },
  {
    id: "color-4",
    color: "#e8e4b0",
    borderColor: "transparent",
    isSelected: false,
  },
];

export const DEFAULT_PAYMENT_HISTORY_PAGE_SIZE_MOCK = 4;
export const PASSWORD_MIN_LENGTH_MOCK = 8;
export const PASSWORD_MAX_LENGTH_MOCK = 16;
