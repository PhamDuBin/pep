"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { ChatMessage as ChatMessageType } from "@/shared/types";
import { ChatMessage } from "../ChatMessage";
import { ChatMessageVariant } from "../../types";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
  loadingText?: string;
  messageVariant?: ChatMessageVariant;
  animateMessages?: boolean;
  typingSpeed?: number;
  charsPerFrame?: number;
  useInternalScroll?: boolean;
  onContentChanged?: () => void;
}

export function ChatMessageList({
  messages,
  isLoading = false,
  loadingText = "AIが考えています...",
  messageVariant = "minimal",
  animateMessages = true,
  typingSpeed = 10,
  charsPerFrame = 5,
  useInternalScroll = true,
  onContentChanged,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const previousMessageCountRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    try {
      const element = containerRef.current;
      if (element) {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "auto",
        });
      }
    } catch {
      // Ignore scroll errors
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!useInternalScroll) return;

    const element = containerRef.current;
    if (element) {
      const atBottom =
        element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
      setShouldScrollToBottom(atBottom);
    }
  }, [useInternalScroll]);

  useEffect(() => {
    onContentChanged?.();

    const currentMessageCount = messages?.length || 0;
    const messagesAdded = currentMessageCount > previousMessageCountRef.current;
    previousMessageCountRef.current = currentMessageCount;

    if (useInternalScroll && (messagesAdded || shouldScrollToBottom)) {
      if (messagesAdded) {
        setShouldScrollToBottom(true);
      }
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [
    messages,
    isLoading,
    useInternalScroll,
    shouldScrollToBottom,
    scrollToBottom,
    onContentChanged,
  ]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-[20px] w-full ${
        useInternalScroll
          ? "h-full overflow-y-auto pr-[8px] overscroll-contain will-change-scroll [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#d1d5db] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[#9ca3af]"
          : ""
      }`}
      onScroll={handleScroll}
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          animate={animateMessages && message.isNew === true}
          variant={messageVariant}
          typingSpeed={typingSpeed}
          charsPerFrame={charsPerFrame}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start animate-[fadeIn_0.3s_ease-out_forwards]">
          {messageVariant === "with-avatar" && (
            <div className="w-[40px] h-[40px] rounded-full bg-[#066a9e] flex items-center justify-center shrink-0 mr-[12px]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="9" cy="9" r="1.5" fill="white" />
                <circle cx="15" cy="9" r="1.5" fill="white" />
              </svg>
            </div>
          )}
          <div className="flex items-center gap-[12px] px-[16px] py-[12px] bg-[#f9fafb] rounded-[8px]">
            <div className="flex items-center gap-[4px] [&>span]:w-[8px] [&>span]:h-[8px] [&>span]:bg-[#066a9e] [&>span]:rounded-full [&>span]:animate-[bounce_1.4s_infinite_ease-in-out_both] [&>span:nth-child(1)]:[-animation-delay:0.32s] [&>span:nth-child(2)]:[-animation-delay:0.16s] [&>span:nth-child(3)]:[-animation-delay:0s]">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="text-[14px] text-[#808080]">{loadingText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
