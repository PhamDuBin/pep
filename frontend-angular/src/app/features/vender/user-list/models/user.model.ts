export type UserRole = '管理者' | 'メンバー';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    avatarColor?: string;
    initials: string;
    selected: boolean;
}

export interface InviteUserRequest {
    email: string;
    role: UserRole;
}

export interface UpdateUserRequest {
    id: number;
    name?: string;
    email?: string;
    role?: UserRole;
}
