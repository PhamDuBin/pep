// =============================================================================
// VENDOR USER LIST SERVICE
// =============================================================================

import { VendorUser, PermissionOption } from "../models";
import {
  VENDOR_USERS_MOCK,
  VENDOR_PERMISSION_OPTIONS_MOCK,
} from "../mock/vendor-user-list.data";

const USE_MOCK = true;

interface ActionResponse {
  success: boolean;
  message?: string;
}

/**
 * Get vendor users
 */
export async function getVendorUsers(): Promise<VendorUser[]> {
  if (USE_MOCK) {
    return VENDOR_USERS_MOCK;
  }

  const res = await fetch("/api/vendor/users");
  if (!res.ok) throw new Error("Failed to fetch vendor users");

  return res.json();
}

/**
 * Get vendor permission options
 */
export async function getVendorPermissionOptions(): Promise<PermissionOption[]> {
  if (USE_MOCK) {
    return VENDOR_PERMISSION_OPTIONS_MOCK;
  }

  const res = await fetch("/api/vendor/users/permission-options");
  if (!res.ok) throw new Error("Failed to fetch permission options");

  return res.json();
}

/**
 * Invite vendor user
 */
export async function inviteVendorUser(
  email: string,
  role: string
): Promise<ActionResponse & { user?: VendorUser }> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: VendorUser = {
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
 * Update vendor user
 */
export async function updateVendorUser(
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
 * Delete vendor users
 */
export async function deleteVendorUsers(
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
