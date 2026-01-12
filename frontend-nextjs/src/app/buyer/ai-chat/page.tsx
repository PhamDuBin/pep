"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TabNavigation,
  ProjectPlanModeButton,
  ChatMessageList,
  ChatInputBox,
} from "@/components";
import { HOME_TABS, MOCK_CHAT_MESSAGES, AI_RESPONSES } from "@/mocks";
import { Tab, ChatMessage } from "@/types";
import styles from "./page.module.scss";

function AiChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  // Handle initial message from query parameter
  useEffect(() => {
    const initialMessage = searchParams.get("message");
    if (initialMessage) {
      handleMessageSent(initialMessage);
      // Clear the query parameter
      router.replace("/buyer/ai-chat");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = useCallback(
    (tab: Tab) => {
      if (tab.id === "carry") {
        router.push("/buyer/carry");
      }
    },
    [router]
  );

  const handleMessageSent = useCallback((message: string) => {
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

    // Simulate AI response
    setTimeout(() => {
      let responseContent = AI_RESPONSES.default;

      // Check for specific keywords
      const lowerMessage = message.toLowerCase();
      if (
        lowerMessage.includes("こんにちは") ||
        lowerMessage.includes("hello")
      ) {
        responseContent = AI_RESPONSES.greeting;
      } else if (
        lowerMessage.includes("rfp") ||
        lowerMessage.includes("提案依頼")
      ) {
        responseContent = AI_RESPONSES.rfp;
      } else if (
        lowerMessage.includes("プロジェクト") ||
        lowerMessage.includes("project")
      ) {
        responseContent = AI_RESPONSES.project;
      } else if (
        lowerMessage.includes("ヘルプ") ||
        lowerMessage.includes("help")
      ) {
        responseContent = AI_RESPONSES.help;
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: responseContent,
        timestamp: new Date(),
        sender: "ai",
        isNew: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleMicrophoneClicked = useCallback(() => {
    console.log("Microphone clicked - voice input not implemented");
  }, []);

  return (
    <div className={styles.container}>
      <TabNavigation tabs={HOME_TABS} onTabChange={handleTabChange} />

      <div className={styles.chatContent}>
        {/* Chat Messages Container */}
        <div className={styles.messagesArea}>
          <div className={styles.messagesWrapper}>
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              messageVariant="minimal"
              animateMessages
            />
          </div>
        </div>

        {/* Bottom Section: Mode Selector + Input */}
        <div className={styles.bottomSection}>
          <ProjectPlanModeButton />
          <ChatInputBox
            onMessageSent={handleMessageSent}
            onMicrophoneClicked={handleMicrophoneClicked}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default function AiChatPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading...</div>}>
      <AiChatContent />
    </Suspense>
  );
}
