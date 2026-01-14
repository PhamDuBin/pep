import { UserProfile, PaymentInfo, PaymentHistory } from '../models/user-settings.model';

export const MOCK_USER_PROFILE: UserProfile = {
    id: '1',
    name: '田中 一郎',
    email: 't-tanaka@a.co.jp',
    avatarColor: '#8EC5D0', // Default blue color
    initials: '田中',
    role: 'admin'
};

export const MOCK_PAYMENT_INFO: PaymentInfo = {
    nextPaymentDate: '2026年2月1日',
    amount: 660000,
    paymentMethod: {
        type: 'visa',
        lastFourDigits: '1111'
    }
};

export const MOCK_PAYMENT_HISTORY: PaymentHistory[] = [
    {
        id: '1',
        paymentDate: '2025/02/01',
        amount: 660000,
        billingPeriod: '2025/02-2026/01',
        status: '支払い済み',
        invoiceUrl: '/invoices/2025-02.pdf'
    }
];
