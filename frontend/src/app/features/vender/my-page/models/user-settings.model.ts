export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    avatarColor?: string;
    initials: string;
    role: 'admin' | 'member';
}

export interface PaymentInfo {
    nextPaymentDate: string;
    amount: number;
    paymentMethod: PaymentMethod;
}

export interface PaymentMethod {
    type: 'visa' | 'mastercard' | 'amex';
    lastFourDigits: string;
    logoUrl?: string;
}

export interface PaymentHistory {
    id: string;
    paymentDate: string;
    amount: number;
    billingPeriod: string;
    status: string;
    invoiceUrl: string;
}

export interface PasswordUpdate {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
