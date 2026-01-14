// =============================================================================
// VENDOR HOME SERVICE
// =============================================================================

import { VendorMessage, VendorMessageThread, VendorThreadMessage } from "../types";
import {
  VENDOR_MESSAGES_MOCK,
  VENDOR_MESSAGE_THREADS_MOCK,
} from "../mock/vendor-home.data";

const USE_MOCK = true;

/**
 * Get vendor messages
 */
export async function getVendorMessages(): Promise<VendorMessage[]> {
  if (USE_MOCK) {
    return VENDOR_MESSAGES_MOCK;
  }

  const res = await fetch("/api/vendor/messages");
  if (!res.ok) throw new Error("Failed to fetch vendor messages");

  return res.json();
}

/**
 * Get message thread by message ID
 */
export async function getMessageThread(
  messageId: string
): Promise<VendorMessageThread | undefined> {
  if (USE_MOCK) {
    return VENDOR_MESSAGE_THREADS_MOCK.find((t) => t.messageId === messageId);
  }

  const res = await fetch(`/api/vendor/messages/${messageId}/thread`);
  if (!res.ok) throw new Error("Failed to fetch message thread");

  return res.json();
}

/**
 * Send message in thread
 */
export async function sendThreadMessage(
  messageId: string,
  content: string
): Promise<VendorThreadMessage> {
  if (USE_MOCK) {
    const now = new Date();
    const timestamp = `${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    return {
      id: `m-${Date.now()}`,
      content,
      timestamp,
      isFromUser: true,
    };
  }

  const res = await fetch(`/api/vendor/messages/${messageId}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Failed to send message");

  return res.json();
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(
  messageId: string
): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    return { success: true };
  }

  const res = await fetch(`/api/vendor/messages/${messageId}/read`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to mark message as read");

  return res.json();
}
