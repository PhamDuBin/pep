"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage as ChatMessageType } from "@/shared/types";
import styles from "./ChatMessage.module.scss";
import { ChatMessageVariant } from "../../types";

interface ChatMessageProps {
  message: ChatMessageType;
  animate?: boolean;
  typingSpeed?: number;
  charsPerFrame?: number;
  variant?: ChatMessageVariant;
  showSkipHint?: boolean;
}

export function ChatMessage({
  message,
  animate = false,
  typingSpeed = 10,
  charsPerFrame = 5,
  variant = "minimal",
  showSkipHint = true,
}: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const currentIndexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isUserMessage = message.sender === "user";
  const hasHighlight = !!message.highlightedText;

  const clearTypingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const skipTyping = useCallback(() => {
    clearTypingTimeout();
    setDisplayedContent(message.content);
    setIsTyping(false);
  }, [clearTypingTimeout, message.content]);

  useEffect(() => {
    if (animate && !isUserMessage && message.isNew) {
      setIsTyping(true);
      setDisplayedContent("");
      currentIndexRef.current = 0;

      const typeNextChars = () => {
        const content = message.content;
        if (currentIndexRef.current < content.length) {
          const charsToAdd = Math.min(
            charsPerFrame,
            content.length - currentIndexRef.current
          );
          setDisplayedContent(
            (prev) =>
              prev +
              content.substring(
                currentIndexRef.current,
                currentIndexRef.current + charsToAdd
              )
          );
          currentIndexRef.current += charsToAdd;

          timeoutRef.current = setTimeout(typeNextChars, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };

      timeoutRef.current = setTimeout(typeNextChars, typingSpeed);
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }

    return () => clearTypingTimeout();
  }, [
    animate,
    isUserMessage,
    message.content,
    message.isNew,
    typingSpeed,
    charsPerFrame,
    clearTypingTimeout,
  ]);

  if (variant === "minimal") {
    return (
      <div
        className={`${styles.messageContainer} ${
          isUserMessage ? styles.userMessage : styles.aiMessage
        } ${message.isNew ? styles.animated : ""}`}
      >
        {isUserMessage ? (
          <div className={styles.userBubble}>
            <p className={styles.messageText}>{displayedContent}</p>
          </div>
        ) : (
          <div className={styles.aiBubble} onClick={skipTyping}>
            <div className={styles.aiMessageContent}>
              <span>{displayedContent}</span>
              {isTyping && <span className={styles.typingCursor}>|</span>}
            </div>
            {hasHighlight && !isTyping && (
              <div className={styles.highlight}>
                <p>{message.highlightedText}</p>
              </div>
            )}
            {isTyping && showSkipHint && (
              <p className={styles.skipHint}>クリックでスキップ</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // With-avatar variant
  return (
    <div
      className={`${styles.messageContainerWithAvatar} ${
        isUserMessage ? styles.userMessageWithAvatar : ""
      }`}
    >
      {!isUserMessage && (
        <div className={styles.aiAvatar}>
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

      <div
        className={`${styles.messageBubbleWithAvatar} ${
          isUserMessage
            ? styles.userBubbleWithAvatar
            : styles.aiBubbleWithAvatar
        }`}
        onClick={skipTyping}
      >
        <span>{displayedContent}</span>
        {isTyping && <span className={styles.typingCursor}>|</span>}
      </div>

      {isUserMessage && (
        <div className={styles.userAvatar}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="8" r="4" stroke="#666" strokeWidth="2" />
            <path
              d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
