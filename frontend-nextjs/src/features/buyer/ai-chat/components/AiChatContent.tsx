"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TabNavigation,
  ProjectPlanModeButton,
  ChatMessageList,
  ChatInputBox,
  PageTransition,
} from "@/components";
import { useAiChat } from "../hooks";
import { AI_CHAT_TABS } from "../mock";
import { Tab } from "../types";
import styles from "../AiChatPage.module.scss";

export function AiChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages, isLoading, sendMessage } = useAiChat();

  // Handle initial message from query parameter
  useEffect(() => {
    const initialMessage = searchParams.get("message");
    if (initialMessage) {
      sendMessage(initialMessage);
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

  const handleMicrophoneClicked = useCallback(() => {
    console.log("Microphone clicked - voice input not implemented");
  }, []);

  return (
    <PageTransition>
      <div className={styles.container}>
        <TabNavigation tabs={AI_CHAT_TABS} onTabChange={handleTabChange} />

        <div className={styles.chatContent}>
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

          <div className={styles.bottomSection}>
            <ProjectPlanModeButton />
            <ChatInputBox
              onMessageSent={sendMessage}
              onMicrophoneClicked={handleMicrophoneClicked}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
