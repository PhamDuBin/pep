import { Injectable, signal } from '@angular/core';
import { UserProfile, PaymentInfo, PaymentHistory, PasswordUpdate } from '../models/user-settings.model';
import { MOCK_USER_PROFILE, MOCK_PAYMENT_INFO, MOCK_PAYMENT_HISTORY } from '../constants/user-settings.constant';

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class MyPageService {
    private userProfile = signal<UserProfile>(MOCK_USER_PROFILE);
    private paymentInfo = signal<PaymentInfo>(MOCK_PAYMENT_INFO);
    private paymentHistory = signal<PaymentHistory[]>(MOCK_PAYMENT_HISTORY);
    private isLoading = signal<boolean>(false);
    private error = signal<string | null>(null);

    // Getters
    getUserProfile() {
        return this.userProfile.asReadonly();
    }

    getPaymentInfo() {
        return this.paymentInfo.asReadonly();
    }

    getPaymentHistory() {
        return this.paymentHistory.asReadonly();
    }

    getIsLoading() {
        return this.isLoading.asReadonly();
    }

    getError() {
        return this.error.asReadonly();
    }

    // Actions
    updateAvatarColor(color: string): void {
        console.log('Updating avatar color to:', color);
        this.setLoading(true);
        this.clearError();

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/user/avatar-color', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ color })
            // });
            
            // Simulate API call
            setTimeout(() => {
                this.userProfile.update(profile => ({ ...profile, avatarColor: color }));
                this.setLoading(false);
                console.log('Avatar color updated successfully');
            }, 500);
        } catch (err) {
            this.setError('Failed to update avatar color');
            this.setLoading(false);
        }
    }

    requestEmailChange(newEmail: string): void {
        console.log('Requesting email change to:', newEmail);
        this.setLoading(true);
        this.clearError();

        try {
            // Validate email format
            if (!this.isValidEmail(newEmail)) {
                throw new Error('Invalid email format');
            }

            // TODO: Replace with actual API call
            // const response = await fetch('/api/user/request-email-change', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ newEmail })
            // });

            // Simulate API call
            setTimeout(() => {
                // In real implementation, this would NOT update the profile immediately
                // Instead, it would send a verification email
                console.log('Verification email sent to:', newEmail);
                this.setLoading(false);
            }, 500);
        } catch (err) {
            this.setError(err instanceof Error ? err.message : 'Failed to request email change');
            this.setLoading(false);
        }
    }

    updatePassword(data: PasswordChangeData): void {
        console.log('Updating password');
        this.setLoading(true);
        this.clearError();

        try {
            // Validate passwords
            if (data.newPassword !== data.confirmPassword) {
                throw new Error('New passwords do not match');
            }
            if (data.newPassword.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            // TODO: Replace with actual API call
            // const response = await fetch('/api/user/change-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         currentPassword: data.currentPassword,
            //         newPassword: data.newPassword
            //     })
            // });

            // Simulate API call
            setTimeout(() => {
                console.log('Password updated successfully');
                this.setLoading(false);
            }, 500);
        } catch (err) {
            this.setError(err instanceof Error ? err.message : 'Failed to update password');
            this.setLoading(false);
        }
    }

    updateUserProfile(updates: Partial<UserProfile>): void {
        console.log('Updating user profile:', updates);
        this.setLoading(true);
        this.clearError();

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/user/profile', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updates)
            // });

            // Simulate API call
            setTimeout(() => {
                this.userProfile.update(profile => ({ ...profile, ...updates }));
                this.setLoading(false);
                console.log('User profile updated successfully');
            }, 500);
        } catch (err) {
            this.setError('Failed to update user profile');
            this.setLoading(false);
        }
    }

    // Payment methods
    updatePaymentMethod(paymentMethod: any): void {
        console.log('Updating payment method:', paymentMethod);
        this.setLoading(true);
        this.clearError();

        try {
            // Validate payment method
            if (!paymentMethod.type || !paymentMethod.lastFourDigits) {
                throw new Error('Invalid payment method');
            }

            // TODO: Replace with actual API call
            // const response = await fetch('/api/user/payment-method', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(paymentMethod)
            // });

            // Simulate API call
            setTimeout(() => {
                this.paymentInfo.update(info => ({ ...info, paymentMethod }));
                this.setLoading(false);
                console.log('Payment method updated successfully');
            }, 500);
        } catch (err) {
            this.setError(err instanceof Error ? err.message : 'Failed to update payment method');
            this.setLoading(false);
        }
    }

    // Download invoice
    downloadInvoice(invoiceUrl: string): void {
        console.log('Downloading invoice:', invoiceUrl);
        this.setLoading(true);
        this.clearError();

        try {
            // TODO: Replace with actual API call for server-side download
            // const response = await fetch(`/api/invoices/download?url=${invoiceUrl}`);
            
            // For client-side download from URL
            if (!invoiceUrl) {
                throw new Error('Invalid invoice URL');
            }

            // Create download link
            const link = document.createElement('a');
            link.href = invoiceUrl;
            link.download = invoiceUrl.split('/').pop() || 'invoice.pdf';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.setLoading(false);
            console.log('Invoice downloaded successfully');
        } catch (err) {
            this.setError(err instanceof Error ? err.message : 'Failed to download invoice');
            this.setLoading(false);
        }
    }

    // Utility methods
    refreshUserData(): void {
        console.log('Refreshing user data');
        this.setLoading(true);
        this.clearError();

        try {
            // TODO: Replace with actual API call
            // const profileRes = await fetch('/api/user/profile');
            // const paymentRes = await fetch('/api/user/payment-info');
            // const historyRes = await fetch('/api/user/payment-history');

            // Simulate API call
            setTimeout(() => {
                this.userProfile.set(MOCK_USER_PROFILE);
                this.paymentInfo.set(MOCK_PAYMENT_INFO);
                this.paymentHistory.set(MOCK_PAYMENT_HISTORY);
                this.setLoading(false);
                console.log('User data refreshed successfully');
            }, 500);
        } catch (err) {
            this.setError('Failed to refresh user data');
            this.setLoading(false);
        }
    }

    // Helper methods
    private setLoading(value: boolean): void {
        this.isLoading.set(value);
    }

    private setError(message: string): void {
        this.error.set(message);
    }

    private clearError(): void {
        this.error.set(null);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
