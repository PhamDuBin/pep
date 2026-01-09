import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserListService } from "../../services/user-list.service";
import { User, UserRole } from "../../models/user.model";
import { DeleteConfirmationModalComponent } from "../common/delete-confirmation-modal/delete-confirmation-modal.component";
import { DeleteSuccessModalComponent } from "../common/delete-success-modal/delete-success-modal.component";
import { EditUserModalComponent } from "../common/edit-user-modal/edit-user-modal.component";
import { EditSuccessModalComponent } from "../common/edit-success-modal/edit-success-modal.component";
import { InviteMemberModalComponent } from "../common/invite-member-modal/invite-member-modal.component";
import { InviteSuccessModalComponent } from "../common/invite-success-modal/invite-success-modal.component";
import { SidebarService } from "../../../shared/services/sidebar.service";

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DeleteConfirmationModalComponent,
        DeleteSuccessModalComponent,
        EditUserModalComponent,
        EditSuccessModalComponent,
        InviteMemberModalComponent,
        InviteSuccessModalComponent
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export class UserListComponent {
    private userListService = inject(UserListService);
    private sidebarService = inject(SidebarService);

    isSidebarCollapsed = this.sidebarService.isCollapsed;

    // Use service getters for data
    users = this.userListService.getUsers();
    isLoading = this.userListService.getIsLoading();
    error = this.userListService.getError();
    allSelected = this.userListService.getAllSelected;

    // Modal states
    showDeleteConfirmModal = signal(false);
    showDeleteSuccessModal = signal(false);
    showEditModal = signal(false);
    showEditSuccessModal = signal(false);
    showInviteModal = signal(false);
    showInviteSuccessModal = signal(false);

    // Modal data
    selectedUserForEdit = signal<User | null>(null);
    editedUserName = signal('');
    editedUserRole = signal<UserRole>('メンバー');

    // Toggle all user selection
    toggleAllSelection(): void {
        this.userListService.toggleAllSelection();
    }

    // Toggle individual user selection
    toggleUserSelection(user: User): void {
        this.userListService.toggleUserSelection(user.id);
    }

    // Invite member action
    onInviteMember(): void {
        this.showInviteModal.set(true);
    }

    // Handle invite confirmation
    onInviteConfirm(emails: string[]): void {
        console.log('Inviting members:', emails);
        // TODO: Call service to send invitations
        this.showInviteModal.set(false);
        this.showInviteSuccessModal.set(true);
    }

    // Handle invite cancel
    onInviteCancel(): void {
        this.showInviteModal.set(false);
    }

    // Close invite success modal
    onCloseInviteSuccess(): void {
        this.showInviteSuccessModal.set(false);
    }

    // Edit user action
    onEditUser(user: User): void {
        this.selectedUserForEdit.set(user);
        this.showEditModal.set(true);
    }

    // Handle edit save
    onEditSave(data: { userId: number, newRole: UserRole }): void {
        const user = this.users().find(u => u.id === data.userId);
        if (user) {
            this.userListService.updateUser({
                id: data.userId,
                role: data.newRole
            });
            this.editedUserName.set(user.name);
            this.editedUserRole.set(data.newRole);
            this.showEditModal.set(false);
            this.showEditSuccessModal.set(true);
        }
    }

    // Handle edit cancel
    onEditCancel(): void {
        this.showEditModal.set(false);
        this.selectedUserForEdit.set(null);
    }

    // Close edit success modal
    onCloseEditSuccess(): void {
        this.showEditSuccessModal.set(false);
        this.editedUserName.set('');
    }

    // Delete selected members action
    onDeleteMembers(): void {
        const selectedUsers = this.users().filter(u => u.selected);
        if (selectedUsers.length === 0) {
            console.log('No users selected');
            return;
        }

        this.showDeleteConfirmModal.set(true);
    }

    // Handle delete confirmation
    onDeleteConfirm(): void {
        const selectedUsers = this.users().filter(u => u.selected);
        const userIds = selectedUsers.map(u => u.id);
        this.userListService.deleteUsers(userIds);
        this.showDeleteConfirmModal.set(false);
        this.showDeleteSuccessModal.set(true);
    }

    // Handle delete cancel
    onDeleteCancel(): void {
        this.showDeleteConfirmModal.set(false);
    }

    // Close delete success modal
    onCloseDeleteSuccess(): void {
        this.showDeleteSuccessModal.set(false);
    }

    // Get selected users for delete modal
    getSelectedUsers(): User[] {
        return this.users().filter(u => u.selected);
    }
}