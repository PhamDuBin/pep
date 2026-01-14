import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  VendorContact,
  VendorChatMessage,
  VendorConversation,
  VendorListResponse,
  ConversationResponse,
  SendMessageResponse,
  ChatMember,
  SearchableUser,
  AddMemberResponse
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
  private _chatMembers = signal<ChatMember[]>([]);
  private _searchResults = signal<SearchableUser[]>([]);
  private _isSearching = signal(false);

  // Public computed signals
  vendors = computed(() => this._vendors());
  selectedVendor = computed(() => this._selectedVendor());
  currentConversation = computed(() => this._currentConversation());
  projectName = computed(() => this._projectName());
  isLoading = computed(() => this._isLoading());
  isSending = computed(() => this._isSending());
  chatMembers = computed(() => this._chatMembers());
  searchResults = computed(() => this._searchResults());
  isSearching = computed(() => this._isSearching());

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

  /**
   * Load members for the current chat
   */
  loadChatMembers(): void {
    const vendor = this._selectedVendor();
    if (!vendor) return;

    this.getChatMembersApi(vendor.id).subscribe({
      next: (members) => {
        this._chatMembers.set(members);
      },
      error: (error) => {
        console.error('Error loading chat members:', error);
      }
    });
  }

  /**
   * Search users by name or email
   */
  searchUsers(query: string): void {
    this._isSearching.set(true);
    this.searchUsersApi(query).subscribe({
      next: (users) => {
        this._searchResults.set(users);
        this._isSearching.set(false);
      },
      error: (error) => {
        console.error('Error searching users:', error);
        this._isSearching.set(false);
      }
    });
  }

  /**
   * Clear search results
   */
  clearSearchResults(): void {
    this._searchResults.set([]);
  }

  /**
   * Add members to the current chat
   */
  addMembers(members: SearchableUser[]): Observable<AddMemberResponse> {
    const vendor = this._selectedVendor();
    if (!vendor) {
      return of({ success: false, members: [] });
    }

    return new Observable(observer => {
      this.addMembersApi(vendor.id, members.map(m => m.id)).subscribe({
        next: (response) => {
          if (response.success) {
            this._chatMembers.set(response.members);
            // Update member count in conversation
            const conversation = this._currentConversation();
            if (conversation) {
              this._currentConversation.set({
                ...conversation,
                memberCount: response.members.length
              });
            }
          }
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Exit from current chat
   */
  exitChat(): Observable<boolean> {
    const vendor = this._selectedVendor();
    if (!vendor) {
      return of(false);
    }

    return new Observable(observer => {
      this.exitChatApi(vendor.id).subscribe({
        next: (success) => {
          if (success) {
            // Remove vendor from list and clear selection
            const updatedVendors = this._vendors().filter(v => v.id !== vendor.id);
            this._vendors.set(updatedVendors);
            this._selectedVendor.set(null);
            this._currentConversation.set(null);
            this._chatMembers.set([]);
          }
          observer.next(success);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
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

  /**
   * Mock: GET /api/carry/chats/:vendorId/members
   */
  private getChatMembersApi(vendorId: string): Observable<ChatMember[]> {
    const mockMembers: ChatMember[] = [
      { id: 'member-1', name: '山田 太郎', initials: '山' },
      { id: 'member-2', name: '田中 花子', initials: '田' },
      { id: 'member-3', name: '鈴木 一郎', initials: '鈴' }
    ];
    return of(mockMembers).pipe(delay(200));
  }

  /**
   * Mock: GET /api/carry/users/search?q=:query
   */
  private searchUsersApi(query: string): Observable<SearchableUser[]> {
    const allUsers: SearchableUser[] = [
      { id: 'user-1', name: '佐藤 健太', email: 'sato@example.com', initials: '佐' },
      { id: 'user-2', name: '高橋 真由美', email: 'takahashi@example.com', initials: '高' },
      { id: 'user-3', name: '渡辺 拓也', email: 'watanabe@example.com', initials: '渡' },
      { id: 'user-4', name: '伊藤 美咲', email: 'ito@example.com', initials: '伊' },
      { id: 'user-5', name: '中村 大輔', email: 'nakamura@example.com', initials: '中' }
    ];

    const filtered = allUsers.filter(
      user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(300));
  }

  /**
   * Mock: POST /api/carry/chats/:vendorId/members
   */
  private addMembersApi(vendorId: string, memberIds: string[]): Observable<AddMemberResponse> {
    const currentMembers = this._chatMembers();
    const newMembers: ChatMember[] = memberIds.map(id => {
      const searchResult = this._searchResults().find(u => u.id === id);
      return {
        id,
        name: searchResult?.name || 'Unknown',
        initials: searchResult?.initials || '?'
      };
    });

    return of({
      success: true,
      members: [...currentMembers, ...newMembers]
    }).pipe(delay(500));
  }

  /**
   * Mock: DELETE /api/carry/chats/:vendorId/exit
   */
  private exitChatApi(vendorId: string): Observable<boolean> {
    return of(true).pipe(delay(300));
  }
}
