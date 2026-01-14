// =============================================================================
// VENDOR MY PAGE SERVICE
// =============================================================================

import {
  VendorUserProfile,
  VendorPaymentInfo,
  VendorPaymentHistory,
} from "../types";
import {
  VENDOR_USER_PROFILE_MOCK,
  VENDOR_PAYMENT_INFO_MOCK,
  VENDOR_PAYMENT_HISTORY_MOCK,
} from "../mock/vendor-my-page.data";

const USE_MOCK = true;

interface ActionResponse {
  success: boolean;
  message?: string;
}

/**
 * Get vendor user profile
 */
export async function getVendorUserProfile(): Promise<VendorUserProfile> {
  if (USE_MOCK) {
    return VENDOR_USER_PROFILE_MOCK;
  }

  const res = await fetch("/api/vendor/profile");
  if (!res.ok) throw new Error("Failed to fetch vendor profile");

  return res.json();
}

/**
 * Get vendor payment info
 */
export async function getVendorPaymentInfo(): Promise<VendorPaymentInfo> {
  if (USE_MOCK) {
    return VENDOR_PAYMENT_INFO_MOCK;
  }

  const res = await fetch("/api/vendor/payment/info");
  if (!res.ok) throw new Error("Failed to fetch payment info");

  return res.json();
}

/**
 * Get vendor payment history
 */
export async function getVendorPaymentHistory(): Promise<VendorPaymentHistory[]> {
  if (USE_MOCK) {
    return VENDOR_PAYMENT_HISTORY_MOCK;
  }

  const res = await fetch("/api/vendor/payment/history");
  if (!res.ok) throw new Error("Failed to fetch payment history");

  return res.json();
}

/**
 * Update vendor avatar color
 */
export async function updateVendorAvatarColor(
  color: string
): Promise<ActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const res = await fetch("/api/vendor/profile/avatar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ avatarColor: color }),
  });

  if (!res.ok) throw new Error("Failed to update avatar");

  return res.json();
}

/**
 * Change vendor password
 */
export async function changeVendorPassword(
  newPassword: string,
  confirmPassword: string
): Promise<ActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (newPassword !== confirmPassword) {
      return { success: false, message: "パスワードが一致しません" };
    }
    return { success: true };
  }

  const res = await fetch("/api/vendor/profile/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword, confirmPassword }),
  });

  if (!res.ok) throw new Error("Failed to change password");

  return res.json();
}

/**
 * Request vendor email change
 */
export async function requestVendorEmailChange(
  newEmail: string
): Promise<ActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: "確認メールを送信しました" };
  }

  const res = await fetch("/api/vendor/profile/email/request-change", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newEmail }),
  });

  if (!res.ok) throw new Error("Failed to request email change");

  return res.json();
}

/**
 * Download vendor invoice
 */
export async function downloadVendorInvoice(invoiceUrl: string): Promise<Blob> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return new Blob(["mock invoice"], { type: "application/pdf" });
  }

  const res = await fetch(invoiceUrl);
  if (!res.ok) throw new Error("Failed to download invoice");

  return res.blob();
}
