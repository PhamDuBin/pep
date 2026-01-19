import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EmailField {
    id: number;
    value: string;
    error: string;
}

@Component({
    selector: 'app-invite-member-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './invite-member-modal.component.html',
    styleUrl: './invite-member-modal.component.scss'
})
export class InviteMemberModalComponent {
    @Input() isOpen = false;
    @Output() invite = new EventEmitter<string[]>();
    @Output() cancel = new EventEmitter<void>();

    emailFields = signal<EmailField[]>([{ id: 1, value: '', error: '' }]);
    private nextId = 2;

    // Email validation regex
    private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    addEmailField(): void {
        this.emailFields.update(fields => [
            ...fields,
            { id: this.nextId++, value: '', error: '' }
        ]);
    }

    removeEmailField(id: number): void {
        // Don't remove if it's the last field
        if (this.emailFields().length > 1) {
            this.emailFields.update(fields => fields.filter(f => f.id !== id));
        }
    }

    validateEmail(field: EmailField): void {
        const trimmedValue = field.value.trim();

        if (!trimmedValue) {
            field.error = '';
            return;
        }

        // Check email format
        if (!this.emailRegex.test(trimmedValue)) {
            field.error = '正しいメールアドレス形式で入力してください';
            return;
        }

        // Check for duplicates
        const emails = this.emailFields().map(f => f.value.trim().toLowerCase());
        const currentIndex = this.emailFields().findIndex(f => f.id === field.id);
        const duplicateIndex = emails.findIndex((email, idx) =>
            email === trimmedValue.toLowerCase() && idx !== currentIndex && email !== ''
        );

        if (duplicateIndex !== -1) {
            field.error = 'このメールアドレスは既に招待されています';
            return;
        }

        field.error = '';
    }

    onEmailChange(field: EmailField): void {
        this.validateEmail(field);
    }

    onInvite(): void {
        // Validate all fields
        this.emailFields().forEach(field => this.validateEmail(field));

        // Check if there are any errors
        const hasErrors = this.emailFields().some(f => f.error !== '');
        if (hasErrors) {
            return;
        }

        // Get valid emails (non-empty)
        const validEmails = this.emailFields()
            .map(f => f.value.trim())
            .filter(email => email !== '');

        if (validEmails.length === 0) {
            return;
        }

        this.invite.emit(validEmails);
        this.resetForm();
    }

    onCancel(): void {
        this.cancel.emit();
        this.resetForm();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.onCancel();
        }
    }

    private resetForm(): void {
        this.emailFields.set([{ id: 1, value: '', error: '' }]);
        this.nextId = 2;
    }
}
