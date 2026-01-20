// =============================================================================
// AI CHAT SERVICE
// =============================================================================

import { ChatMessage, Tab } from "../models";
import {
  AI_CHAT_TABS_MOCK,
  CHAT_MESSAGES_MOCK,
  AI_RESPONSES_MOCK,
} from "../mock/ai-chat.data";

const USE_MOCK = true;

/**
 * Get initial chat messages
 */
export async function getChatMessages(): Promise<ChatMessage[]> {
  if (USE_MOCK) {
    return CHAT_MESSAGES_MOCK;
  }

  const res = await fetch("/api/ai-chat/messages");
  if (!res.ok) throw new Error("Failed to fetch chat messages");

  return res.json();
}

/**
 * Get AI chat tabs
 */
export async function getAiChatTabs(): Promise<Tab[]> {
  if (USE_MOCK) {
    return AI_CHAT_TABS_MOCK;
  }

  const res = await fetch("/api/ai-chat/tabs");
  if (!res.ok) throw new Error("Failed to fetch tabs");

  return res.json();
}

/**
 * Send message to AI and get response
 */
export async function sendMessageToAi(message: string): Promise<string> {
  if (USE_MOCK) {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("こんにちは") ||
      lowerMessage.includes("hello")
    ) {
      return AI_RESPONSES_MOCK.greeting;
    } else if (
      lowerMessage.includes("rfp") ||
      lowerMessage.includes("提案依頼")
    ) {
      return AI_RESPONSES_MOCK.rfp;
    } else if (
      lowerMessage.includes("プロジェクト") ||
      lowerMessage.includes("project")
    ) {
      return AI_RESPONSES_MOCK.project;
    } else if (
      lowerMessage.includes("ヘルプ") ||
      lowerMessage.includes("help")
    ) {
      return AI_RESPONSES_MOCK.help;
    }

    return AI_RESPONSES_MOCK.default;
  }

  const res = await fetch("/api/ai-chat/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Failed to send message");

  const data = await res.json();
  return data.response;
}
