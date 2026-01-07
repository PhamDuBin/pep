import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  UserProfile,
  PaymentInfo,
  PaymentHistoryRecord,
  AvatarColorOption,
  MyPageModalType,
  PasswordChangeData,
  EmailChangeData,
  ActionResponse,
  PaymentHistoryResponse
} from '../models/my-page.model';
import {
  MOCK_ADMIN_USER,
  MOCK_PAYMENT_INFO,
  MOCK_PAYMENT_HISTORY,
  AVATAR_COLOR_OPTIONS,
  DEFAULT_PAYMENT_HISTORY_PAGE_SIZE
} from '../constants/my-page.constant';

@Injectable({
  providedIn: 'root'
})
export class MyPageService {
  // State signals
  private _userProfile = signal<UserProfile | null>(null);
  private _paymentInfo = signal<PaymentInfo | null>(null);
  private _paymentHistory = signal<PaymentHistoryRecord[]>([]);
  private _avatarColorOptions = signal<AvatarColorOption[]>(AVATAR_COLOR_OPTIONS);
  private _currentPage = signal<number>(1);
  private _totalCount = signal<number>(0);
  private _isLoading = signal<boolean>(false);
  private _isSaving = signal<boolean>(false);
  private _activeModal = signal<MyPageModalType>(null);
  private _showPassword = signal<boolean>(false);
  private _showConfirmPassword = signal<boolean>(false);

  // Form state signals
  private _newPassword = signal<string>('');
  private _confirmPassword = signal<string>('');
  private _newEmail = signal<string>('');
  private _confirmEmail = signal<string>('');

  // Public computed signals
  userProfile = computed(() => this._userProfile());
  paymentInfo = computed(() => this._paymentInfo());
  paymentHistory = computed(() => this._paymentHistory());
  avatarColorOptions = computed(() => this._avatarColorOptions());
  currentPage = computed(() => this._currentPage());
  totalCount = computed(() => this._totalCount());
  isLoading = computed(() => this._isLoading());
  isSaving = computed(() => this._isSaving());
  activeModal = computed(() => this._activeModal());
  showPassword = computed(() => this._showPassword());
  showConfirmPassword = computed(() => this._showConfirmPassword());
  newPassword = computed(() => this._newPassword());
  confirmPassword = computed(() => this._confirmPassword());
  newEmail = computed(() => this._newEmail());
  confirmEmail = computed(() => this._confirmEmail());

  // Computed for total pages
  totalPages = computed(() => Math.ceil(this._totalCount() / DEFAULT_PAYMENT_HISTORY_PAGE_SIZE));

  // Computed for checking if user is admin
  isAdmin = computed(() => this._userProfile()?.role === 'admin');

  // Computed for selected avatar color
  selectedAvatarColor = computed(() => {
    const selected = this._avatarColorOptions().find(opt => opt.isSelected);
    return selected?.color || '#8ec5d0';
  });

  constructor() {
    this.loadUserData();
  }

  /**
   * Load all user data
   */
  loadUserData(): void {
    this._isLoading.set(true);

    // Simulate API calls
    this.getUserProfileApi().subscribe({
      next: (user) => {
        this._userProfile.set(user);

        // Load payment data only for admin users
        if (user.role === 'admin') {
          this.loadPaymentInfo();
          this.loadPaymentHistory();
        }

        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this._isLoading.set(false);
      }
    });
  }

  /**
   * Load payment information
   */
  loadPaymentInfo(): void {
    this.getPaymentInfoApi().subscribe({
      next: (info) => {
        this._paymentInfo.set(info);
      },
      error: (error) => {
        console.error('Error loading payment info:', error);
      }
    });
  }

  /**
   * Load payment history
   */
  loadPaymentHistory(): void {
    this.getPaymentHistoryApi(this._currentPage()).subscribe({
      next: (response) => {
        this._paymentHistory.set(response.records);
        this._totalCount.set(response.totalCount);
      },
      error: (error) => {
        console.error('Error loading payment history:', error);
      }
    });
  }

  /**
   * Open modal
   */
  openModal(modalType: MyPageModalType): void {
    this._activeModal.set(modalType);
    // Reset form fields when opening modal
    if (modalType === 'email-change') {
      this._newEmail.set('');
      this._confirmEmail.set('');
    }
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this._activeModal.set(null);
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this._showPassword.update(show => !show);
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this._showConfirmPassword.update(show => !show);
  }

  /**
   * Set new password value
   */
  setNewPassword(value: string): void {
    this._newPassword.set(value);
  }

  /**
   * Set confirm password value
   */
  setConfirmPassword(value: string): void {
    this._confirmPassword.set(value);
  }

  /**
   * Set new email value
   */
  setNewEmail(value: string): void {
    this._newEmail.set(value);
  }

  /**
   * Set confirm email value
   */
  setConfirmEmail(value: string): void {
    this._confirmEmail.set(value);
  }

  /**
   * Save password changes
   */
  savePasswordChanges(): Observable<ActionResponse> {
    this._isSaving.set(true);

    const data: PasswordChangeData = {
      currentPassword: '**********',
      newPassword: this._newPassword(),
      confirmPassword: this._confirmPassword()
    };

    return new Observable(observer => {
      this.updatePasswordApi(data).subscribe({
        next: (response) => {
          this._isSaving.set(false);
          this._newPassword.set('');
          this._confirmPassword.set('');
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this._isSaving.set(false);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Send email change request
   */
  sendEmailChangeRequest(): Observable<ActionResponse> {
    this._isSaving.set(true);

    const data: EmailChangeData = {
      newEmail: this._newEmail(),
      confirmEmail: this._confirmEmail()
    };

    return new Observable(observer => {
      this.requestEmailChangeApi(data).subscribe({
        next: (response) => {
          this._isSaving.set(false);
          if (response.success) {
            this._activeModal.set('email-sent');
          }
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this._isSaving.set(false);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Select avatar color
   */
  selectAvatarColor(colorId: string): void {
    this._avatarColorOptions.update(options =>
      options.map(opt => ({
        ...opt,
        isSelected: opt.id === colorId,
        borderColor: opt.id === colorId ? '#066a9e' : 'transparent'
      }))
    );
  }

  /**
   * Save avatar color
   */
  saveAvatarColor(): Observable<ActionResponse> {
    this._isSaving.set(true);

    const selectedColor = this.selectedAvatarColor();

    return new Observable(observer => {
      this.updateAvatarColorApi(selectedColor).subscribe({
        next: (response) => {
          this._isSaving.set(false);
          if (response.success) {
            this._userProfile.update(user => {
              if (user) {
                return { ...user, avatarColor: selectedColor };
              }
              return user;
            });
            this.closeModal();
          }
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this._isSaving.set(false);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Go to specific page in payment history
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this._currentPage.set(page);
      this.loadPaymentHistory();
    }
  }

  /**
   * Download invoice
   */
  downloadInvoice(recordId: string): void {
    console.log('Downloading invoice:', recordId);
    // In real implementation, this would trigger a file download
  }

  // ==========================================
  // Mock API Methods (Replace with real API)
  // ==========================================

  /**
   * Mock: GET /api/user/profile
   */
  private getUserProfileApi(): Observable<UserProfile> {
    // Return admin user by default (can be changed to MOCK_MEMBER_USER for testing)
    return of(MOCK_ADMIN_USER).pipe(delay(200));
  }

  /**
   * Mock: GET /api/payment/info
   */
  private getPaymentInfoApi(): Observable<PaymentInfo> {
    return of(MOCK_PAYMENT_INFO).pipe(delay(200));
  }

  /**
   * Mock: GET /api/payment/history
   */
  private getPaymentHistoryApi(page: number): Observable<PaymentHistoryResponse> {
    const totalCount = MOCK_PAYMENT_HISTORY.length;
    const startIndex = (page - 1) * DEFAULT_PAYMENT_HISTORY_PAGE_SIZE;
    const records = MOCK_PAYMENT_HISTORY.slice(
      startIndex,
      startIndex + DEFAULT_PAYMENT_HISTORY_PAGE_SIZE
    );

    return of({
      records,
      totalCount,
      page,
      pageSize: DEFAULT_PAYMENT_HISTORY_PAGE_SIZE
    }).pipe(delay(200));
  }

  /**
   * Mock: PUT /api/user/password
   */
  private updatePasswordApi(data: PasswordChangeData): Observable<ActionResponse> {
    console.log('Updating password:', data);
    return of({ success: true, message: 'Password updated successfully' }).pipe(delay(500));
  }

  /**
   * Mock: POST /api/user/email/change-request
   */
  private requestEmailChangeApi(data: EmailChangeData): Observable<ActionResponse> {
    console.log('Requesting email change:', data);
    return of({ success: true, message: 'Email change request sent' }).pipe(delay(500));
  }

  /**
   * Mock: PUT /api/user/avatar
   */
  private updateAvatarColorApi(color: string): Observable<ActionResponse> {
    console.log('Updating avatar color:', color);
    return of({ success: true, message: 'Avatar updated successfully' }).pipe(delay(500));
  }
}
