import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyPageModalType } from '../../../models/my-page.model';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-email-change-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './email-change-modal.component.html',
  styleUrl: './email-change-modal.component.scss'
})
export class EmailChangeModalComponent {
  @Input() isOpen: boolean = false;
  @Input() modalType: MyPageModalType = 'email-change';
  @Input() newEmail: string = '';
  @Input() confirmEmail: string = '';
  @Input() isSaving: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() newEmailChange = new EventEmitter<string>();
  @Output() confirmEmailChange = new EventEmitter<string>();
  @Output() sendEmail = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onNewEmailInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.newEmailChange.emit(value);
  }

  onConfirmEmailInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.confirmEmailChange.emit(value);
  }

  onSendEmail(): void {
    this.sendEmail.emit();
  }
}
