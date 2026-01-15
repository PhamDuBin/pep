// =============================================================================
// USER LIST SERVICE
// =============================================================================

import {
  User,
  UserPermission,
  PermissionOption,
  UserActionResponse,
} from "../types/types";
import { USERS_MOCK, PERMISSION_OPTIONS_MOCK } from "../mock/user-list.data";

const USE_MOCK = true;

/**
 * Get list of users
 */
export async function getUsers(): Promise<User[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return USERS_MOCK;
  }

  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");

  return res.json();
}

/**
 * Get permission options
 */
export async function getPermissionOptions(): Promise<PermissionOption[]> {
  if (USE_MOCK) {
    return PERMISSION_OPTIONS_MOCK;
  }

  const res = await fetch("/api/users/permission-options");
  if (!res.ok) throw new Error("Failed to fetch permission options");

  return res.json();
}

/**
 * Update user permission
 */
export async function updateUserPermission(
  userId: string,
  newPermission: UserPermission
): Promise<UserActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const res = await fetch(`/api/users/${userId}/permission`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permission: newPermission }),
  });

  if (!res.ok) throw new Error("Failed to update permission");

  return res.json();
}

/**
 * Delete users
 */
export async function deleteUsers(
  userIds: string[]
): Promise<UserActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const res = await fetch("/api/users/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIds }),
  });

  if (!res.ok) throw new Error("Failed to delete users");

  return res.json();
}

/**
 * Invite user
 */
export async function inviteUser(
  email: string,
  permission: UserPermission
): Promise<UserActionResponse & { user?: User }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0],
      initials: email.slice(0, 2).toUpperCase(),
      avatarColor: "#8ec5d0",
      permission,
      email,
      isSelected: false,
    };
    return { success: true, user: newUser };
  }

  const res = await fetch("/api/users/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, permission }),
  });

  if (!res.ok) throw new Error("Failed to invite user");

  return res.json();
}
