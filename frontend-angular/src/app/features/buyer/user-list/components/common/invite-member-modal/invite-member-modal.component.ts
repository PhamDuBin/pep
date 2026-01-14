import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

export interface EmailEntry {
  value: string;
  error: string | null;
}

@Component({
  selector: 'app-invite-member-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './invite-member-modal.component.html',
  styleUrl: './invite-member-modal.component.scss'
})
export class InviteMemberModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() modalType: 'form' | 'complete' = 'form';
  @Input() isSaving: boolean = false;
  @Input() existingEmails: string[] = []; // Emails already in the system

  @Output() close = new EventEmitter<void>();
  @Output() sendInvitation = new EventEmitter<string[]>();

  emails: EmailEntry[] = [];

  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.modalType === 'form') {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.emails = [{ value: '', error: null }];
  }

  onClose(): void {
    this.close.emit();
  }

  onEmailChange(index: number): void {
    // Clear error when user starts typing
    this.emails[index].error = null;
  }

  addEmailField(): void {
    // Add new email field only if the current one has a value
    this.emails.push({ value: '', error: null });
  }

  canAddMore(): boolean {
    // Can add more if the last email field has a value
    const lastEmail = this.emails[this.emails.length - 1];
    return lastEmail && lastEmail.value.trim().length > 0;
  }

  validateEmail(email: string): string | null {
    if (!email.trim()) {
      return null; // Empty is ok, will be filtered out
    }

    if (!this.EMAIL_REGEX.test(email.trim())) {
      return '正しいメールアドレス形式で入力してください';
    }

    if (this.existingEmails.includes(email.trim().toLowerCase())) {
      return 'このメールアドレスは既に招待されています';
    }

    // Check for duplicates within the form
    const duplicateCount = this.emails.filter(
      e => e.value.trim().toLowerCase() === email.trim().toLowerCase()
    ).length;
    if (duplicateCount > 1) {
      return 'このメールアドレスは既に入力されています';
    }

    return null;
  }

  validateAllEmails(): boolean {
    let isValid = true;

    this.emails.forEach((entry, index) => {
      if (entry.value.trim()) {
        const error = this.validateEmail(entry.value);
        this.emails[index].error = error;
        if (error) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  hasValidEmails(): boolean {
    return this.emails.some(e => e.value.trim() && !this.validateEmail(e.value));
  }

  onSendInvitation(): void {
    if (!this.validateAllEmails()) {
      return;
    }

    const validEmails = this.emails
      .filter(e => e.value.trim() && !e.error)
      .map(e => e.value.trim());

    if (validEmails.length > 0) {
      this.sendInvitation.emit(validEmails);
    }
  }

  getPlaceholder(): string {
    return 'email@address.com';
  }
}
