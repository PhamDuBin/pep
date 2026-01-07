import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordInputComponent } from '../password-input/password-input.component';

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

@Component({
    selector: 'app-password-change-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, PasswordInputComponent],
    templateUrl: './password-change-modal.component.html',
    styleUrl: './password-change-modal.component.scss'
})
export class PasswordChangeModalComponent {
    @Input() isOpen = false;

    @Output() passwordChange = new EventEmitter<PasswordChangeData>();
    @Output() close = new EventEmitter<void>();

    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    errorMessage = '';

    onSave(): void {
        // Validate all fields are filled
        if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
            this.errorMessage = 'すべてのフィールドを入力してください';
            return;
        }

        // Check if new passwords match
        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = '新しいパスワードが一致しません';
            return;
        }

        // Check password length (minimum 8 characters)
        if (this.newPassword.length < 8) {
            this.errorMessage = 'パスワードは8文字以上である必要があります';
            return;
        }

        // Emit the password change data
        this.passwordChange.emit({
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword
        });
        this.resetForm();
    }

    onClose(): void {
        this.resetForm();
        this.close.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
            this.onClose();
        }
    }

    private resetForm(): void {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.errorMessage = '';
    }
}
