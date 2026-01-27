// =============================================================================
// USER LIST SERVICE
// =============================================================================

import { User, PermissionOption } from "../models";
import {
  USERS_MOCK,
  PERMISSION_OPTIONS_MOCK,
} from "../mock/user-list.data";

const USE_MOCK = true;

interface ActionResponse {
  success: boolean;
  message?: string;
}

/**
 * Get users
 */
export async function getUsers(): Promise<User[]> {
  if (USE_MOCK) {
    return USERS_MOCK;
  }

  const res = await fetch("/api/vendor/users");
  if (!res.ok) throw new Error("Failed to fetch vendor users");

  return res.json();
}

/**
 * Get permission options
 */
export async function getPermissionOptions(): Promise<PermissionOption[]> {
  if (USE_MOCK) {
    return PERMISSION_OPTIONS_MOCK;
  }

  const res = await fetch("/api/vendor/users/permission-options");
  if (!res.ok) throw new Error("Failed to fetch permission options");

  return res.json();
}

/**
 * Invite user
 */
export async function inviteUser(
  email: string,
  role: string
): Promise<ActionResponse & { user?: User }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: email.split("@")[0],
      initials: email.slice(0, 2).toUpperCase(),
      email,
      avatarColor: "#8EC5D0",
      role,
      selected: false,
    };
    return { success: true, user: newUser };
  }

  const res = await fetch("/api/vendor/users/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role }),
  });

  if (!res.ok) throw new Error("Failed to invite user");

  return res.json();
}

/**
 * Update user
 */
export async function updateUser(
  userId: string,
  name: string,
  role: string
): Promise<ActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const res = await fetch(`/api/vendor/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role }),
  });

  if (!res.ok) throw new Error("Failed to update user");

  return res.json();
}

/**
 * Delete users
 */
export async function deleteUsers(
  userIds: string[]
): Promise<ActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const res = await fetch("/api/vendor/users/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIds }),
  });

  if (!res.ok) throw new Error("Failed to delete users");

  return res.json();
}
