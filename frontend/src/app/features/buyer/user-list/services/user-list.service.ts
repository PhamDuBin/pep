import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  User,
  UserPermission,
  UserListModalType,
  PermissionChangeData,
  DeleteUsersData,
  InviteMembersData,
  UserListResponse,
  UserActionResponse,
  PermissionChangeModalState
} from '../models/user-list.model';
import { MOCK_USERS, PERMISSION_LABELS } from '../constants/user-list.constant';

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  // State signals
  private _users = signal<User[]>([]);
  private _isLoading = signal<boolean>(false);
  private _isSaving = signal<boolean>(false);
  private _activeModal = signal<UserListModalType>(null);
  private _permissionChangeState = signal<PermissionChangeModalState>({
    userId: null,
    userName: '',
    currentPermission: null,
    newPermission: null
  });
  private _invitedEmails = signal<string[]>([]);

  // Public computed signals
  users = computed(() => this._users());
  isLoading = computed(() => this._isLoading());
  isSaving = computed(() => this._isSaving());
  activeModal = computed(() => this._activeModal());
  permissionChangeState = computed(() => this._permissionChangeState());
  invitedEmails = computed(() => this._invitedEmails());

  // Get all existing emails (users + invited)
  existingEmails = computed(() => {
    const userEmails = this._users()
      .filter(u => u.email)
      .map(u => u.email!.toLowerCase());
    const invited = this._invitedEmails().map(e => e.toLowerCase());
    return [...new Set([...userEmails, ...invited])];
  });

  // Computed for selected users
  selectedUsers = computed(() => this._users().filter(user => user.isSelected));
  selectedUserIds = computed(() => this.selectedUsers().map(user => user.id));
  hasSelectedUsers = computed(() => this.selectedUsers().length > 0);
  selectedCount = computed(() => this.selectedUsers().length);

  // Computed for all selected state (for header checkbox)
  isAllSelected = computed(() => {
    const users = this._users();
    return users.length > 0 && users.every(user => user.isSelected);
  });

  constructor() {
    this.loadUsers();
  }

  /**
   * Load all users
   */
  loadUsers(): void {
    this._isLoading.set(true);

    this.getUsersApi().subscribe({
      next: (response) => {
        this._users.set(response.users);
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this._isLoading.set(false);
      }
    });
  }

  /**
   * Toggle user selection
   */
  toggleUserSelection(userId: string): void {
    this._users.update(users =>
      users.map(user =>
        user.id === userId
          ? { ...user, isSelected: !user.isSelected }
          : user
      )
    );
  }

  /**
   * Toggle all users selection
   */
  toggleAllSelection(): void {
    const allSelected = this.isAllSelected();
    this._users.update(users =>
      users.map(user => ({ ...user, isSelected: !allSelected }))
    );
  }

  /**
   * Clear all selections
   */
  clearSelection(): void {
    this._users.update(users =>
      users.map(user => ({ ...user, isSelected: false }))
    );
  }

  /**
   * Open permission change modal
   */
  openPermissionChangeModal(userId: string): void {
    const user = this._users().find(u => u.id === userId);
    if (user) {
      this._permissionChangeState.set({
        userId: user.id,
        userName: user.name,
        currentPermission: user.permission,
        newPermission: user.permission
      });
      this._activeModal.set('permission-change');
    }
  }

  /**
   * Set new permission in modal
   */
  setNewPermission(permission: UserPermission): void {
    this._permissionChangeState.update(state => ({
      ...state,
      newPermission: permission
    }));
  }

  /**
   * Confirm permission change
   */
  confirmPermissionChange(): Observable<UserActionResponse> {
    const state = this._permissionChangeState();
    if (!state.userId || !state.newPermission) {
      return of({ success: false, message: 'Invalid state' });
    }

    this._isSaving.set(true);

    const data: PermissionChangeData = {
      userId: state.userId,
      newPermission: state.newPermission
    };

    return new Observable(observer => {
      this.updatePermissionApi(data).subscribe({
        next: (response) => {
          this._isSaving.set(false);
          if (response.success) {
            // Update local state
            this._users.update(users =>
              users.map(user =>
                user.id === state.userId
                  ? { ...user, permission: state.newPermission! }
                  : user
              )
            );
            // Show completion modal
            this._activeModal.set('permission-change-complete');
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
   * Open delete confirmation modal
   */
  openDeleteConfirmModal(): void {
    if (this.hasSelectedUsers()) {
      this._activeModal.set('delete-confirm');
    }
  }

  /**
   * Confirm delete users
   */
  confirmDeleteUsers(): Observable<UserActionResponse> {
    const userIds = this.selectedUserIds();
    if (userIds.length === 0) {
      return of({ success: false, message: 'No users selected' });
    }

    this._isSaving.set(true);

    const data: DeleteUsersData = { userIds };

    return new Observable(observer => {
      this.deleteUsersApi(data).subscribe({
        next: (response) => {
          this._isSaving.set(false);
          if (response.success) {
            // Remove deleted users from local state
            this._users.update(users =>
              users.filter(user => !userIds.includes(user.id))
            );
            // Show completion modal
            this._activeModal.set('delete-complete');
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
   * Open invite member modal
   */
  openInviteMemberModal(): void {
    this._activeModal.set('invite-member');
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this._activeModal.set(null);
    // Reset permission change state
    this._permissionChangeState.set({
      userId: null,
      userName: '',
      currentPermission: null,
      newPermission: null
    });
  }

  /**
   * Get permission label
   */
  getPermissionLabel(permission: UserPermission): string {
    return PERMISSION_LABELS[permission] || permission;
  }

  // ==========================================
  // Mock API Methods (Replace with real API)
  // ==========================================

  /**
   * Mock: GET /api/users
   */
  private getUsersApi(): Observable<UserListResponse> {
    return of({
      users: [...MOCK_USERS],
      totalCount: MOCK_USERS.length,
      success: true
    }).pipe(delay(300));
  }

  /**
   * Mock: PUT /api/users/:id/permission
   */
  private updatePermissionApi(data: PermissionChangeData): Observable<UserActionResponse> {
    console.log('Updating permission:', data);
    return of({
      success: true,
      message: 'Permission updated successfully'
    }).pipe(delay(500));
  }

  /**
   * Mock: DELETE /api/users
   */
  private deleteUsersApi(data: DeleteUsersData): Observable<UserActionResponse> {
    console.log('Deleting users:', data);
    return of({
      success: true,
      message: 'Users deleted successfully'
    }).pipe(delay(500));
  }

  /**
   * Confirm invite members
   */
  confirmInviteMembers(emails: string[]): Observable<UserActionResponse> {
    if (emails.length === 0) {
      return of({ success: false, message: 'No emails provided' });
    }

    this._isSaving.set(true);

    const data: InviteMembersData = { emails };

    return new Observable(observer => {
      this.inviteMembersApi(data).subscribe({
        next: (response) => {
          this._isSaving.set(false);
          if (response.success) {
            // Add invited emails to the list
            this._invitedEmails.update(current => [
              ...current,
              ...emails.map(e => e.toLowerCase())
            ]);
            // Show completion modal
            this._activeModal.set('invite-member-complete');
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
   * Mock: POST /api/users/invite
   */
  private inviteMembersApi(data: InviteMembersData): Observable<UserActionResponse> {
    console.log('Inviting members:', data);
    return of({
      success: true,
      message: 'Invitations sent successfully'
    }).pipe(delay(500));
  }
}
