import {
  UserProfile,
  PaymentInfo,
  PaymentHistoryRecord,
  AvatarColorOption
} from '../models/my-page.model';

/**
 * Mock admin user profile matching Figma G-01 design
 */
export const MOCK_ADMIN_USER: UserProfile = {
  id: 'user-admin-1',
  name: '田中　一郎',
  initials: 'TY',
  email: 'i-tanaka@a.co.jp',
  avatarColor: '#8ec5d0',
  role: 'admin'
};

/**
 * Mock member user profile matching Figma G-01 Member design
 */
export const MOCK_MEMBER_USER: UserProfile = {
  id: 'user-member-1',
  name: '東 次郎',
  initials: 'TY',
  email: 'z-azuma@b.co.jp',
  avatarColor: '#8ec5d0',
  role: 'member'
};

/**
 * Mock payment information matching Figma design
 */
export const MOCK_PAYMENT_INFO: PaymentInfo = {
  nextBillingDate: '2026年2月1日',
  billingAmount: 4334,
  taxIncluded: true,
  paymentMethod: {
    id: 'pm-1',
    type: 'visa',
    lastFourDigits: '1111',
    expiryDate: '12/28'
  }
};

/**
 * Mock payment history records matching Figma design
 */
export const MOCK_PAYMENT_HISTORY: PaymentHistoryRecord[] = [
  {
    id: 'ph-1',
    paymentDate: '2026/01/01',
    amount: 3784,
    usagePeriod: '2026/01/01-2026/02/01',
    status: 'paid'
  },
  {
    id: 'ph-2',
    paymentDate: '2025/12/01',
    amount: 3784,
    usagePeriod: '2025/12/01-2026/01/01',
    status: 'paid'
  },
  {
    id: 'ph-3',
    paymentDate: '2025/11/01',
    amount: 3234,
    usagePeriod: '2025/11/01-2025/10/01',
    status: 'paid'
  },
  {
    id: 'ph-4',
    paymentDate: '2025/10/01',
    amount: 3234,
    usagePeriod: '2026/10/01-2026/11/01',
    status: 'paid'
  }
];

/**
 * Avatar color options matching Figma G-04 design
 */
export const AVATAR_COLOR_OPTIONS: AvatarColorOption[] = [
  {
    id: 'color-1',
    color: '#8ec5d0',
    borderColor: '#066a9e',
    isSelected: true
  },
  {
    id: 'color-2',
    color: '#e8b4d8',
    borderColor: 'transparent',
    isSelected: false
  },
  {
    id: 'color-3',
    color: '#90d4a8',
    borderColor: 'transparent',
    isSelected: false
  },
  {
    id: 'color-4',
    color: '#e8e4b0',
    borderColor: 'transparent',
    isSelected: false
  }
];

/**
 * Page size for payment history pagination
 */
export const DEFAULT_PAYMENT_HISTORY_PAGE_SIZE = 4;

/**
 * Password validation rules
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 16;
