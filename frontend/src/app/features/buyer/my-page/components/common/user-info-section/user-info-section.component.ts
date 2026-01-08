import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../../models/my-page.model';

@Component({
  selector: 'app-user-info-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-info-section.component.html',
  styleUrl: './user-info-section.component.scss'
})
export class UserInfoSectionComponent {
  @Input() user: UserProfile | null = null;
  @Input() newPassword: string = '';
  @Input() confirmPassword: string = '';
  @Input() showPassword: boolean = false;
  @Input() showConfirmPassword: boolean = false;
  @Input() isSaving: boolean = false;
  @Input() showAvatarSaveSuccess: boolean = false;

  @Output() openAvatarModal = new EventEmitter<void>();
  @Output() openEmailModal = new EventEmitter<void>();
  @Output() newPasswordChange = new EventEmitter<string>();
  @Output() confirmPasswordChange = new EventEmitter<string>();
  @Output() togglePasswordVisibility = new EventEmitter<void>();
  @Output() toggleConfirmPasswordVisibility = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<void>();
  @Output() clearAvatarSaveSuccess = new EventEmitter<void>();

  onAvatarClick(): void {
    this.openAvatarModal.emit();
  }

  onChangeEmailClick(): void {
    this.openEmailModal.emit();
  }

  onNewPasswordInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.newPasswordChange.emit(value);
  }

  onConfirmPasswordInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.confirmPasswordChange.emit(value);
  }

  onTogglePassword(): void {
    this.togglePasswordVisibility.emit();
  }

  onToggleConfirmPassword(): void {
    this.toggleConfirmPasswordVisibility.emit();
  }

  onSaveChanges(): void {
    this.saveChanges.emit();
  }

  onDismissAvatarSuccess(): void {
    this.clearAvatarSaveSuccess.emit();
  }
}
