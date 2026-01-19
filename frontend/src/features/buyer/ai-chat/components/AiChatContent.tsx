"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TabNavigation,
  ProjectPlanModeButton,
  ChatMessageList,
  ChatInputBox,
  PageTransition,
} from "@/shared/components";
import { useAiChat } from "../hooks";
import { AI_CHAT_TABS } from "../mock";
import { Tab } from "../types";

export function AiChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages, isLoading, handleMessageSend } = useAiChat();

  // Handle initial message from query parameter
  useEffect(() => {
    const initialMessage = searchParams.get("message");
    if (initialMessage) {
      handleMessageSend(initialMessage);
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
      <div className="flex flex-col h-full bg-white">
        <TabNavigation tabs={AI_CHAT_TABS} onTabChange={handleTabChange} />

        <div className="flex flex-col h-[calc(100vh-89px-94px)] bg-white py-[50px] px-[75px]">
          <div className="flex-1 flex flex-col gap-[25px] items-center overflow-hidden">
            <div className="w-full max-w-[800px] flex-1 overflow-hidden">
              <ChatMessageList
                messages={messages}
                isLoading={isLoading}
                messageVariant="minimal"
                animateMessages
              />
            </div>
          </div>

          <div className="flex flex-col gap-[20px] items-center justify-center w-full max-w-[800px] mx-auto pt-[20px]">
            <ProjectPlanModeButton />
            <ChatInputBox
              onMessageSent={handleMessageSend}
              onMicrophoneClicked={handleMicrophoneClicked}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
