// =============================================================================
// BUYER CARRY SERVICE
// =============================================================================

import {
  VendorContact,
  VendorChatMessage,
  VendorConversation,
  ChatMember,
  SendMessageResponse,
} from "../models";
import {
  VENDOR_CONTACTS_MOCK,
  VENDOR_CHAT_MESSAGES_MOCK,
  CONVERSATION_MOCK,
  MEMBERS_MOCK,
  CURRENT_PROJECT_NAME_MOCK,
} from "../mock/carry.data";

const USE_MOCK = true;

/**
 * Get list of vendor contacts
 */
export async function getVendorContacts(): Promise<VendorContact[]> {
  if (USE_MOCK) {
    return VENDOR_CONTACTS_MOCK;
  }

  const res = await fetch("/api/carry/vendors");
  if (!res.ok) throw new Error("Failed to fetch vendor contacts");

  return res.json();
}

/**
 * Get current project name
 */
export async function getCurrentProjectName(): Promise<string> {
  if (USE_MOCK) {
    return CURRENT_PROJECT_NAME_MOCK;
  }

  const res = await fetch("/api/carry/project");
  if (!res.ok) throw new Error("Failed to fetch project name");

  const data = await res.json();
  return data.projectName;
}

/**
 * Get chat messages for a vendor
 */
export async function getVendorMessages(
  vendorId: string
): Promise<VendorChatMessage[]> {
  if (USE_MOCK) {
    return VENDOR_CHAT_MESSAGES_MOCK;
  }

  const res = await fetch(`/api/carry/vendors/${vendorId}/messages`);
  if (!res.ok) throw new Error("Failed to fetch vendor messages");

  return res.json();
}

/**
 * Get conversation details with a vendor
 */
export async function getVendorConversation(
  vendorId: string
): Promise<VendorConversation> {
  if (USE_MOCK) {
    return {
      ...CONVERSATION_MOCK,
      vendorId,
    };
  }

  const res = await fetch(`/api/carry/vendors/${vendorId}/conversation`);
  if (!res.ok) throw new Error("Failed to fetch conversation");

  return res.json();
}

/**
 * Get chat members
 */
export async function getChatMembers(vendorId: string): Promise<ChatMember[]> {
  if (USE_MOCK) {
    return MEMBERS_MOCK;
  }

  const res = await fetch(`/api/carry/vendors/${vendorId}/members`);
  if (!res.ok) throw new Error("Failed to fetch chat members");

  return res.json();
}

/**
 * Send a message to vendor
 */
export async function sendMessage(
  vendorId: string,
  content: string
): Promise<SendMessageResponse> {
  if (USE_MOCK) {
    const message: VendorChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date().toLocaleString("ja-JP", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "buyer",
      senderName: "山田 太郎",
    };
    return { success: true, message };
  }

  const res = await fetch(`/api/carry/vendors/${vendorId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Failed to send message");

  return res.json();
}

/**
 * Exit from vendor conversation
 */
export async function exitVendorConversation(
  vendorId: string
): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    return { success: true };
  }

  const res = await fetch(`/api/carry/vendors/${vendorId}/exit`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to exit conversation");

  return res.json();
}
