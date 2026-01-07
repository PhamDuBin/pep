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

    // Actions
    updateAvatarColor(color: string): void {
        console.log('Updating avatar color to:', color);
        // TODO: Implement actual API call to update avatar color on server
        this.userProfile.update(profile => ({ ...profile, avatarColor: color }));
    }

    requestEmailChange(newEmail: string): void {
        console.log('Requesting email change to:', newEmail);
        // TODO: Implement actual API call to request email change
        // In real implementation, this would send a verification email
        // and not update the profile until the user confirms via email link
    }

    updatePassword(data: PasswordChangeData): void {
        console.log('Updating password');
        // TODO: Implement actual API call to update password on server
        // Validate current password
        // Update to new password
        // Return success/error
    }

    updateUserProfile(updates: Partial<UserProfile>): void {
        console.log('Updating user profile:', updates);
        // TODO: Implement actual API call to update user profile
        this.userProfile.update(profile => ({ ...profile, ...updates }));
    }

    // Payment methods
    updatePaymentMethod(paymentMethod: PaymentInfo['paymentMethod']): void {
        console.log('Updating payment method:', paymentMethod);
        // TODO: Implement actual API call to update payment method
        this.paymentInfo.update(info => ({ ...info, paymentMethod }));
    }

    // Utility methods
    refreshUserData(): void {
        console.log('Refreshing user data');
        // TODO: Implement actual API call to fetch fresh user data
        // For now, just reset to mock data
        this.userProfile.set(MOCK_USER_PROFILE);
        this.paymentInfo.set(MOCK_PAYMENT_INFO);
        this.paymentHistory.set(MOCK_PAYMENT_HISTORY);
    }
}
