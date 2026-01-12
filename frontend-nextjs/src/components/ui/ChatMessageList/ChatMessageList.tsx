"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { ChatMessage as ChatMessageType } from "@/types";
import { ChatMessage, ChatMessageVariant } from "../ChatMessage";
import styles from "./ChatMessageList.module.scss";

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
      className={`${styles.messageContainer} ${
        useInternalScroll ? styles.scrollable : ""
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
        <div className={styles.loadingContainer}>
          {messageVariant === "with-avatar" && (
            <div className={styles.loadingAvatar}>
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
          <div className={styles.loadingBubble}>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className={styles.loadingText}>{loadingText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
