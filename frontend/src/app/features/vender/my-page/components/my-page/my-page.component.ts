import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserAvatarComponent } from '../common/user-avatar/user-avatar.component';
import { PasswordInputComponent } from '../common/password-input/password-input.component';
import { EmailChangeModalComponent } from '../common/email-change/email-change-modal.component';
import { EmailChangeSuccessModalComponent } from '../common/email-change-success/email-change-success-modal.component';
import { PasswordChangeModalComponent, PasswordChangeData } from '../common/password-change/password-change-modal.component';
import { AvatarUploadModalComponent } from '../common/avatar-upload/avatar-upload.component';
import { MyPageService } from '../../services/my-page.service';
import { PasswordUpdate } from '../../models/user-settings.model';

@Component({
    selector: 'app-my-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        UserAvatarComponent,
        PasswordInputComponent,
        EmailChangeModalComponent,
        EmailChangeSuccessModalComponent,
        PasswordChangeModalComponent,
        AvatarUploadModalComponent
    ],
    templateUrl: './my-page.component.html',
    styleUrl: './my-page.component.scss'
})
export class MyPageComponent {
    private myPageService = inject(MyPageService);

    // Use service getters for data
    userProfile = this.myPageService.getUserProfile();
    paymentInfo = this.myPageService.getPaymentInfo();
    paymentHistory = this.myPageService.getPaymentHistory();

    // Modal states
    showEmailModal = signal(false);
    showEmailSuccessModal = signal(false);
    showPasswordModal = signal(false);
    showAvatarModal = signal(false);

    passwordData: PasswordUpdate = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    // G-04: Avatar upload modal
    onAvatarUpload() {
        this.showAvatarModal.set(true);
    }

    onAvatarColorChange(color: string) {
        this.myPageService.updateAvatarColor(color);
        this.showAvatarModal.set(false);
    }

    onCloseAvatarModal() {
        this.showAvatarModal.set(false);
    }

    // G-02: Email change modal
    onEmailChange() {
        this.showEmailModal.set(true);
    }

    onEmailSent() {
        // Email was sent successfully, show success modal (G-03)
        this.myPageService.requestEmailChange(''); // Email validation already done in modal
        this.showEmailSuccessModal.set(true);
    }

    onCloseEmailModal() {
        this.showEmailModal.set(false);
    }

    onCloseEmailSuccessModal() {
        this.showEmailSuccessModal.set(false);
    }

    // G-03: Password change modal (triggered from save button)
    onSaveChanges() {
        console.log('Save button clicked. Password data:', this.passwordData);

        // Check if any password fields are filled
        if (this.passwordData.newPassword || this.passwordData.confirmPassword) {
            // Validate password fields
            if (!this.passwordData.newPassword || !this.passwordData.confirmPassword) {
                console.log('Both password fields are required');
                return;
            }

            if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
                console.log('Passwords do not match');
                return;
            }

            // Validate password length (8-16 characters)
            if (this.passwordData.newPassword.length < 8 || this.passwordData.newPassword.length > 16) {
                console.log('Password must be 8-16 characters');
                return;
            }

            // Validate alphanumeric
            const alphanumericRegex = /^[a-zA-Z0-9]+$/;
            if (!alphanumericRegex.test(this.passwordData.newPassword)) {
                console.log('Password must be alphanumeric only');
                return;
            }

            // All validations passed, show confirmation modal
            this.showPasswordModal.set(true);
        } else {
            // No password change, just save other changes
            console.log('Changes saved successfully');
        }
    }


    onPasswordChangeSubmit(data: PasswordChangeData) {
        this.myPageService.updatePassword(data);
        this.showPasswordModal.set(false);
    }

    onClosePasswordModal() {
        this.showPasswordModal.set(false);
    }

    downloadInvoice(invoiceUrl: string) {
        this.myPageService.downloadInvoice(invoiceUrl);
    }
}
