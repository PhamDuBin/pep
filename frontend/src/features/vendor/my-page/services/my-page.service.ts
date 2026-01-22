// =============================================================================
// MY PAGE SERVICE
// =============================================================================

import {
  UserProfile,
  PaymentInfo,
  PaymentHistory,
  PaymentFormData,
} from "../models";
import {
  USER_PROFILE_MOCK,
  PAYMENT_INFO_MOCK,
  PAYMENT_HISTORY_MOCK,
} from "../mock/my-page.data";

const USE_MOCK = true;

// Mock storage for added payment method
let mockPaymentMethod: PaymentInfo["paymentMethod"] | null = null;

interface ActionResponse {
  success: boolean;
  message?: string;
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  if (USE_MOCK) {
    return USER_PROFILE_MOCK;
  }

  const res = await fetch("/api/vendor/profile");
  if (!res.ok) throw new Error("Failed to fetch vendor profile");

  return res.json();
}

/**
 * Get payment info
 */
export async function getPaymentInfo(): Promise<PaymentInfo> {
  if (USE_MOCK) {
    // Return updated payment info with stored payment method if available
    return {
      ...PAYMENT_INFO_MOCK,
      paymentMethod: mockPaymentMethod || PAYMENT_INFO_MOCK.paymentMethod,
    };
  }

  const res = await fetch("/api/vendor/payment/info");
  if (!res.ok) throw new Error("Failed to fetch payment info");

  return res.json();
}

/**
 * Get payment history
 */
export async function getPaymentHistory(): Promise<PaymentHistory[]> {
  if (USE_MOCK) {
    return PAYMENT_HISTORY_MOCK;
  }

  const res = await fetch("/api/vendor/payment/history");
  if (!res.ok) throw new Error("Failed to fetch payment history");

  return res.json();
}

/**
 * Update avatar color
 */
export async function updateAvatarColor(
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
 * Change password
 */
export async function changePassword(
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
 * Request email change
 */
export async function requestEmailChange(
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
 * Add payment method
 */
export async function addPaymentMethod(
  paymentData: PaymentFormData
): Promise<ActionResponse> {
  if (USE_MOCK) {
    // Extract card type from card number (first digit)
    const firstDigit = paymentData.cardNumber.charAt(0);
    let cardType: "visa" | "mastercard" | "amex" | "jcb" = "visa";
    if (firstDigit === "4") cardType = "visa";
    else if (firstDigit === "5") cardType = "mastercard";
    else if (firstDigit === "3") cardType = "amex";
    else if (firstDigit === "3") cardType = "jcb";

    // Store the new payment method
    mockPaymentMethod = {
      type: cardType,
      lastFourDigits: paymentData.cardNumber.slice(-4),
    };

    return { success: true };
  }

  const res = await fetch("/api/vendor/payment/method", {
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
export async function downloadInvoice(invoiceUrl: string): Promise<Blob> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return new Blob(["mock invoice"], { type: "application/pdf" });
  }

  const res = await fetch(invoiceUrl);
  if (!res.ok) throw new Error("Failed to download invoice");

  return res.blob();
}

