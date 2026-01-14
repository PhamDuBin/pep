import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-email-change-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './email-change-modal.component.html',
    styleUrl: './email-change-modal.component.scss'
})
export class EmailChangeModalComponent {
    @Input() isOpen = false;

    @Output() emailSent = new EventEmitter<void>(); // Changed to indicate email was sent
    @Output() close = new EventEmitter<void>();

    newEmail = '';
    confirmEmail = '';
    errorMessage = '';

    onSave(): void {
        // Validate emails
        if (!this.newEmail || !this.confirmEmail) {
            this.errorMessage = 'メールアドレスを入力してください';
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.newEmail)) {
            this.errorMessage = '有効なメールアドレスを入力してください';
            return;
        }

        // Check if emails match
        if (this.newEmail !== this.confirmEmail) {
            this.errorMessage = 'メールアドレスが一致しません';
            return;
        }

        // Emit success - email sent
        this.emailSent.emit();
        this.resetForm();
        this.close.emit();
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
        this.newEmail = '';
        this.confirmEmail = '';
        this.errorMessage = '';
    }
}
