import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  VendorContact,
  VendorChatMessage,
  VendorConversation,
  VendorListResponse,
  ConversationResponse,
  SendMessageResponse
} from '../models/carry.model';
import {
  MOCK_VENDOR_CONTACTS,
  MOCK_CONVERSATION,
  CURRENT_PROJECT_NAME
} from '../constants/carry.constant';

@Injectable({
  providedIn: 'root'
})
export class CarryService {
  // State signals
  private _vendors = signal<VendorContact[]>([]);
  private _selectedVendor = signal<VendorContact | null>(null);
  private _currentConversation = signal<VendorConversation | null>(null);
  private _projectName = signal<string>(CURRENT_PROJECT_NAME);
  private _isLoading = signal(false);
  private _isSending = signal(false);

  // Public computed signals
  vendors = computed(() => this._vendors());
  selectedVendor = computed(() => this._selectedVendor());
  currentConversation = computed(() => this._currentConversation());
  projectName = computed(() => this._projectName());
  isLoading = computed(() => this._isLoading());
  isSending = computed(() => this._isSending());

  currentMessages = computed(() => {
    const conversation = this._currentConversation();
    return conversation?.messages || [];
  });

  memberCount = computed(() => {
    const conversation = this._currentConversation();
    return conversation?.memberCount || 0;
  });

  constructor() {
    this.loadVendors();
  }

  /**
   * Load vendors from API (mock implementation)
   * GET /api/carry/vendors
   */
  loadVendors(): void {
    this._isLoading.set(true);

    // Mock API call
    this.getVendorsApi().subscribe({
      next: (response) => {
        this._vendors.set(response.vendors);
        this._projectName.set(response.projectName);
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
        this._isLoading.set(false);
      }
    });
  }

  /**
   * Select a vendor and load their conversation
   */
  selectVendor(vendor: VendorContact): void {
    // Update selection state
    const updatedVendors = this._vendors().map(v => ({
      ...v,
      isSelected: v.id === vendor.id
    }));
    this._vendors.set(updatedVendors);
    this._selectedVendor.set(vendor);

    // Load conversation
    this.loadConversation(vendor.id);
  }

  /**
   * Clear vendor selection
   */
  clearSelection(): void {
    const updatedVendors = this._vendors().map(v => ({
      ...v,
      isSelected: false
    }));
    this._vendors.set(updatedVendors);
    this._selectedVendor.set(null);
    this._currentConversation.set(null);
  }

  /**
   * Load conversation for a vendor
   * GET /api/carry/conversations/:vendorId
   */
  private loadConversation(vendorId: string): void {
    this._isLoading.set(true);

    this.getConversationApi(vendorId).subscribe({
      next: (response) => {
        this._currentConversation.set({
          vendorId: response.vendorId,
          vendorName: response.vendorName,
          memberCount: response.memberCount,
          messages: response.messages
        });
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading conversation:', error);
        this._isLoading.set(false);
      }
    });
  }

  /**
   * Send a message to the selected vendor
   * POST /api/carry/messages
   */
  sendMessage(content: string): Observable<SendMessageResponse> {
    const vendor = this._selectedVendor();
    if (!vendor) {
      return of({ success: false, message: {} as VendorChatMessage });
    }

    this._isSending.set(true);

    return new Observable(observer => {
      this.sendMessageApi(vendor.id, content).subscribe({
        next: (response) => {
          if (response.success) {
            // Add message to conversation
            const conversation = this._currentConversation();
            if (conversation) {
              this._currentConversation.set({
                ...conversation,
                messages: [...conversation.messages, response.message]
              });
            }

            // Update vendor's last message
            this.updateVendorLastMessage(vendor.id, content);
          }
          this._isSending.set(false);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this._isSending.set(false);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Update vendor's last message in the list
   */
  private updateVendorLastMessage(vendorId: string, message: string): void {
    const vendors = this._vendors().map(v => {
      if (v.id === vendorId) {
        return {
          ...v,
          lastMessage: message,
          lastMessageTime: this.formatCurrentTime()
        };
      }
      return v;
    });
    this._vendors.set(vendors);
  }

  /**
   * Format current time as MM/DD HH:mm
   */
  private formatCurrentTime(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  }

  /**
   * Reset state
   */
  resetState(): void {
    this._selectedVendor.set(null);
    this._currentConversation.set(null);
    this.loadVendors();
  }

  // ==========================================
  // Mock API Methods (Replace with real API)
  // ==========================================

  /**
   * Mock: GET /api/carry/vendors
   */
  private getVendorsApi(): Observable<VendorListResponse> {
    const response: VendorListResponse = {
      vendors: MOCK_VENDOR_CONTACTS,
      projectName: CURRENT_PROJECT_NAME
    };
    return of(response).pipe(delay(200));
  }

  /**
   * Mock: GET /api/carry/conversations/:vendorId
   */
  private getConversationApi(vendorId: string): Observable<ConversationResponse> {
    // Return mock conversation for vendor-1, empty for others
    if (vendorId === 'vendor-1') {
      return of(MOCK_CONVERSATION).pipe(delay(200));
    }

    const vendor = MOCK_VENDOR_CONTACTS.find(v => v.id === vendorId);
    const emptyConversation: ConversationResponse = {
      vendorId,
      vendorName: vendor?.name || '',
      memberCount: 1,
      messages: []
    };
    return of(emptyConversation).pipe(delay(200));
  }

  /**
   * Mock: POST /api/carry/messages
   */
  private sendMessageApi(vendorId: string, content: string): Observable<SendMessageResponse> {
    const newMessage: VendorChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: this.formatCurrentTime(),
      sender: 'buyer',
      senderName: '山田 太郎'
    };

    return of({
      success: true,
      message: newMessage
    }).pipe(delay(300));
  }
}
