import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoSectionComponent } from '../common/user-info-section/user-info-section.component';
import { PaymentInfoSectionComponent } from '../common/payment-info-section/payment-info-section.component';
import { PaymentHistoryTableComponent } from '../common/payment-history-table/payment-history-table.component';
import { EmailChangeModalComponent } from '../common/email-change-modal/email-change-modal.component';
import { AvatarChangeModalComponent } from '../common/avatar-change-modal/avatar-change-modal.component';
import { MyPageService } from '../../services/my-page.service';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [
    CommonModule,
    UserInfoSectionComponent,
    PaymentInfoSectionComponent,
    PaymentHistoryTableComponent,
    EmailChangeModalComponent,
    AvatarChangeModalComponent,
  ],
  templateUrl: './my-page.component.html',
  styleUrl: './my-page.component.scss',
})
export class MyPageComponent implements OnInit {
  // Computed signals from service
  userProfile = computed(() => this.myPageService.userProfile());
  paymentInfo = computed(() => this.myPageService.paymentInfo());
  paymentHistory = computed(() => this.myPageService.paymentHistory());
  avatarColorOptions = computed(() => this.myPageService.avatarColorOptions());
  currentPage = computed(() => this.myPageService.currentPage());
  totalPages = computed(() => this.myPageService.totalPages());
  isLoading = computed(() => this.myPageService.isLoading());
  isSaving = computed(() => this.myPageService.isSaving());
  activeModal = computed(() => this.myPageService.activeModal());
  isAdmin = computed(() => this.myPageService.isAdmin());
  showPassword = computed(() => this.myPageService.showPassword());
  showConfirmPassword = computed(() => this.myPageService.showConfirmPassword());
  newPassword = computed(() => this.myPageService.newPassword());
  confirmPassword = computed(() => this.myPageService.confirmPassword());
  newEmail = computed(() => this.myPageService.newEmail());
  confirmEmail = computed(() => this.myPageService.confirmEmail());
  showAvatarSaveSuccess = computed(() => this.myPageService.showAvatarSaveSuccess());

  constructor(private myPageService: MyPageService) {}

  ngOnInit(): void {
    // Service loads data in constructor
  }

  // Avatar click handler
  onAvatarClick(): void {
    this.myPageService.openModal('avatar-change');
  }

  // Email change link handler
  onEmailChangeClick(): void {
    this.myPageService.openModal('email-change');
  }

  // Password visibility handlers
  onTogglePasswordVisibility(): void {
    this.myPageService.togglePasswordVisibility();
  }

  onToggleConfirmPasswordVisibility(): void {
    this.myPageService.toggleConfirmPasswordVisibility();
  }

  // Password input handlers
  onNewPasswordInput(value: string): void {
    this.myPageService.setNewPassword(value);
  }

  onConfirmPasswordInput(value: string): void {
    this.myPageService.setConfirmPassword(value);
  }

  // Save password handler
  onSavePassword(): void {
    this.myPageService.savePasswordChanges().subscribe({
      next: (response) => {
        console.log('Password saved:', response);
      },
      error: (error) => {
        console.error('Error saving password:', error);
      },
    });
  }

  // Add payment method handler
  onAddPaymentMethod(): void {
    console.log('Add payment method clicked');
    // TODO: Navigate to payment method page or open modal
  }

  // Pagination handler
  onPageChange(page: number): void {
    this.myPageService.goToPage(page);
  }

  // Download invoice handler
  onDownloadInvoice(recordId: string): void {
    this.myPageService.downloadInvoice(recordId);
  }

  // Modal handlers
  onCloseModal(): void {
    this.myPageService.closeModal();
  }

  // Email modal handlers
  onNewEmailInput(value: string): void {
    this.myPageService.setNewEmail(value);
  }

  onConfirmEmailInput(value: string): void {
    this.myPageService.setConfirmEmail(value);
  }

  onSendEmailChange(): void {
    this.myPageService.sendEmailChangeRequest().subscribe({
      next: (response) => {
        console.log('Email change request sent:', response);
      },
      error: (error) => {
        console.error('Error sending email change request:', error);
      },
    });
  }

  // Avatar modal handlers
  onSelectAvatarColor(colorId: string): void {
    this.myPageService.selectAvatarColor(colorId);
  }

  onSaveAvatar(): void {
    this.myPageService.saveAvatarColor().subscribe({
      next: (response) => {
        console.log('Avatar saved:', response);
      },
      error: (error) => {
        console.error('Error saving avatar:', error);
      },
    });
  }

  onClearAvatarSaveSuccess(): void {
    this.myPageService.clearAvatarSaveSuccess();
  }

  // Helper for pagination
  get pageNumbers(): number[] {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
