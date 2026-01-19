import { Injectable, signal, computed } from '@angular/core';
import { User, InviteUserRequest, UpdateUserRequest } from '../models/user.model';
import { MOCK_USERS } from '../constants/user-list.constant';

@Injectable({
    providedIn: 'root'
})
export class UserListService {
    private users = signal<User[]>(MOCK_USERS);
    private isLoading = signal<boolean>(false);
    private error = signal<string | null>(null);

    // Getters
    getUsers() {
        return this.users.asReadonly();
    }

    getIsLoading() {
        return this.isLoading.asReadonly();
    }

    getError() {
        return this.error.asReadonly();
    }

    // Computed properties
    getSelectedUsers = computed(() => {
        return this.users().filter(u => u.selected);
    });

    getAllSelected = computed(() => {
        const userList = this.users();
        return userList.length > 0 && userList.every(u => u.selected);
    });

    // Actions
    toggleAllSelection(): void {
        const newState = !this.getAllSelected();
        this.users.update(users =>
            users.map(u => ({ ...u, selected: newState }))
        );
    }

    toggleUserSelection(userId: number): void {
        this.users.update(users =>
            users.map(u => u.id === userId ? { ...u, selected: !u.selected } : u)
        );
    }

    inviteMember(request: InviteUserRequest): void {
        console.log('Inviting member:', request);
        this.setLoading(true);
        this.clearError();

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/users/invite', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(request)
            // });

            // Simulate API call
            setTimeout(() => {
                // In real implementation, this would add the new user from API response
                const newUser: User = {
                    id: this.users().length + 1,
                    name: request.email.split('@')[0],
                    email: request.email,
                    role: request.role,
                    avatarColor: '#8EC5D0',
                    initials: this.generateInitials(request.email),
                    selected: false
                };

                this.users.update(users => [...users, newUser]);
                this.setLoading(false);
                console.log('Member invited successfully');
            }, 500);
        } catch (err) {
            this.setError('Failed to invite member');
            this.setLoading(false);
        }
    }

    updateUser(request: UpdateUserRequest): void {
        console.log('Updating user:', request);
        this.setLoading(true);
        this.clearError();

        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/users/${request.id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(request)
            // });

            // Simulate API call
            setTimeout(() => {
                this.users.update(users =>
                    users.map(u => u.id === request.id ? { ...u, ...request } : u)
                );
                this.setLoading(false);
                console.log('User updated successfully');
            }, 500);
        } catch (err) {
            this.setError('Failed to update user');
            this.setLoading(false);
        }
    }

    deleteUsers(userIds: number[]): void {
        console.log('Deleting users:', userIds);
        this.setLoading(true);
        this.clearError();

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/users/batch-delete', {
            //     method: 'DELETE',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ userIds })
            // });

            // Simulate API call
            setTimeout(() => {
                this.users.update(users =>
                    users.filter(u => !userIds.includes(u.id))
                );
                this.setLoading(false);
                console.log('Users deleted successfully');
            }, 500);
        } catch (err) {
            this.setError('Failed to delete users');
            this.setLoading(false);
        }
    }

    refreshUsers(): void {
        console.log('Refreshing users');
        this.setLoading(true);
        this.clearError();

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/users');
            // const data = await response.json();

            // Simulate API call
            setTimeout(() => {
                this.users.set(MOCK_USERS);
                this.setLoading(false);
                console.log('Users refreshed successfully');
            }, 500);
        } catch (err) {
            this.setError('Failed to refresh users');
            this.setLoading(false);
        }
    }

    // Helper methods
    private setLoading(value: boolean): void {
        this.isLoading.set(value);
    }

    private setError(message: string): void {
        this.error.set(message);
    }

    private clearError(): void {
        this.error.set(null);
    }

    private generateInitials(email: string): string {
        const name = email.split('@')[0];
        const parts = name.split('.');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
}
