import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from '../common/user-table/user-table.component';
import { PermissionChangeModalComponent } from '../common/permission-change-modal/permission-change-modal.component';
import { DeleteConfirmModalComponent } from '../common/delete-confirm-modal/delete-confirm-modal.component';
import { UserListService } from '../../services/user-list.service';
import { UserPermission } from '../../models/user-list.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    UserTableComponent,
    PermissionChangeModalComponent,
    DeleteConfirmModalComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  // Computed signals from service
  users = computed(() => this.userListService.users());
  isLoading = computed(() => this.userListService.isLoading());
  isSaving = computed(() => this.userListService.isSaving());
  activeModal = computed(() => this.userListService.activeModal());
  permissionChangeState = computed(() => this.userListService.permissionChangeState());
  isAllSelected = computed(() => this.userListService.isAllSelected());
  hasSelectedUsers = computed(() => this.userListService.hasSelectedUsers());
  selectedCount = computed(() => this.userListService.selectedCount());

  constructor(private userListService: UserListService) {}

  ngOnInit(): void {
    // Service loads data in constructor
  }

  // User selection handlers
  onToggleSelection(userId: string): void {
    this.userListService.toggleUserSelection(userId);
  }

  onToggleAllSelection(): void {
    this.userListService.toggleAllSelection();
  }

  // Invite member handler
  onInviteMember(): void {
    this.userListService.openInviteMemberModal();
    // For now, just log - implement invite modal later if needed
    console.log('Invite member clicked');
  }

  // Permission change handlers
  onChangePermission(userId: string): void {
    this.userListService.openPermissionChangeModal(userId);
  }

  onSelectPermission(permission: UserPermission): void {
    this.userListService.setNewPermission(permission);
  }

  onConfirmPermissionChange(): void {
    this.userListService.confirmPermissionChange().subscribe({
      next: (response) => {
        console.log('Permission changed:', response);
      },
      error: (error) => {
        console.error('Error changing permission:', error);
      }
    });
  }

  // Delete handlers
  onDeleteMembers(): void {
    this.userListService.openDeleteConfirmModal();
  }

  onConfirmDelete(): void {
    this.userListService.confirmDeleteUsers().subscribe({
      next: (response) => {
        console.log('Users deleted:', response);
      },
      error: (error) => {
        console.error('Error deleting users:', error);
      }
    });
  }

  // Modal close handler
  onCloseModal(): void {
    this.userListService.closeModal();
  }

  // Check if permission change modal is open
  isPermissionModalOpen(): boolean {
    const modal = this.activeModal();
    return modal === 'permission-change' || modal === 'permission-change-complete';
  }

  // Get permission modal type
  getPermissionModalType(): 'select' | 'complete' {
    return this.activeModal() === 'permission-change-complete' ? 'complete' : 'select';
  }

  // Check if delete modal is open
  isDeleteModalOpen(): boolean {
    const modal = this.activeModal();
    return modal === 'delete-confirm' || modal === 'delete-complete';
  }

  // Get delete modal type
  getDeleteModalType(): 'confirm' | 'complete' {
    return this.activeModal() === 'delete-complete' ? 'complete' : 'confirm';
  }
}
