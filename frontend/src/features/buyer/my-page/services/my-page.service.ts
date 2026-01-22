// =============================================================================
// MY PAGE SERVICE
// =============================================================================

import {
  UserProfile,
  PaymentInfo,
  PaymentHistoryRecord,
  AvatarColorOption,
  ActionResponse,
} from "../models";
import {
  ADMIN_USER_MOCK,
  PAYMENT_INFO_MOCK,
  PAYMENT_HISTORY_MOCK,
  AVATAR_COLOR_OPTIONS_MOCK,
} from "../mock/my-page.data";
import { PASSWORD_ERRORS } from "@/shared/errors/error-messages";

const USE_MOCK = true;

/**
 * Get current user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return ADMIN_USER_MOCK;
  }

  const res = await fetch("/api/users/profile");
  if (!res.ok) throw new Error("Failed to fetch user profile");

  return res.json();
}

/**
 * Get payment information
 */
export async function getPaymentInfo(): Promise<PaymentInfo> {
  if (USE_MOCK) {
    return PAYMENT_INFO_MOCK;
  }

  const res = await fetch("/api/payment/info");
  if (!res.ok) throw new Error("Failed to fetch payment info");

  return res.json();
}

/**
 * Get payment history
 */
export async function getPaymentHistory(): Promise<PaymentHistoryRecord[]> {
  if (USE_MOCK) {
    return PAYMENT_HISTORY_MOCK;
  }

  const res = await fetch("/api/payment/history");
  if (!res.ok) throw new Error("Failed to fetch payment history");

  return res.json();
}

/**
 * Get avatar color options
 */
export async function getAvatarColorOptions(): Promise<AvatarColorOption[]> {
  if (USE_MOCK) {
    return AVATAR_COLOR_OPTIONS_MOCK;
  }

  const res = await fetch("/api/users/avatar-colors");
  if (!res.ok) throw new Error("Failed to fetch avatar colors");

  return res.json();
}

/**
 * Update user avatar color
 */
export async function updateAvatarColor(color: string): Promise<ActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const res = await fetch("/api/users/avatar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ avatarColor: color }),
  });

  if (!res.ok) throw new Error("Failed to update avatar");

  return res.json();
}

/**
 * Change password
 */
export async function changePassword(
  newPassword: string,
  confirmPassword: string
): Promise<ActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (newPassword !== confirmPassword) {
      return { success: false, message: PASSWORD_ERRORS.MISMATCH };
    }
    return { success: true };
  }

  const res = await fetch("/api/users/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword, confirmPassword }),
  });

  if (!res.ok) throw new Error("Failed to change password");

  return res.json();
}

/**
 * Request email change
 */
export async function requestEmailChange(newEmail: string): Promise<ActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: "確認メールを送信しました" };
  }

  const res = await fetch("/api/users/email/request-change", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newEmail }),
  });

  if (!res.ok) throw new Error("Failed to request email change");

  return res.json();
}

/**
 * Add payment method
 */
export async function addPaymentMethod(
  paymentData: unknown
): Promise<ActionResponse> {
  if (USE_MOCK) {
    return { success: true };
  }

  const res = await fetch("/api/payment/method", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });

  if (!res.ok) throw new Error("Failed to add payment method");

  return res.json();
}

/**
 * Download invoice
 */
export async function downloadInvoice(recordId: string): Promise<Blob> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return new Blob(["mock invoice"], { type: "application/pdf" });
  }

  const res = await fetch(`/api/payment/invoices/${recordId}/download`);
  if (!res.ok) throw new Error("Failed to download invoice");

  return res.blob();
}
