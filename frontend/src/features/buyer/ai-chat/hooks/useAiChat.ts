"use client";

// =============================================================================
// AI CHAT HOOK
// =============================================================================

import { useState, useCallback, useEffect } from "react";
import { ChatMessage } from "../types";
import { getChatMessages, sendMessageToAi } from "../services/ai-chat.service";

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      const initialMessages = await getChatMessages();
      setMessages(initialMessages);
    };
    loadMessages();
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      timestamp: new Date(),
      sender: "user",
      isNew: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response from service
      const responseContent = await sendMessageToAi(message);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: responseContent,
        timestamp: new Date(),
        sender: "ai",
        isNew: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
