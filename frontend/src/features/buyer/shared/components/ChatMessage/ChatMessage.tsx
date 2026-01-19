"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage as ChatMessageType } from "@/shared/types";
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
        className={`flex w-full ${
          isUserMessage ? "justify-end" : "justify-start"
        } ${message.isNew ? "animate-[slideIn_0.3s_ease-out]" : ""}`}
      >
        {isUserMessage ? (
          <div className="max-w-[70%] bg-[#066a9e] text-[#ffffff] p-[10px] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1),0_2px_4px_-2px_rgb(0_0_0/0.1)]">
            <p className="text-[14px] font-normal leading-[1.5] whitespace-pre-wrap">
              {displayedContent}
            </p>
          </div>
        ) : (
          <div
            className="max-w-[600px] relative cursor-pointer"
            onClick={skipTyping}
          >
            <div className="text-[14px] text-[#333333] font-normal leading-[1.5] whitespace-pre-wrap">
              <span>{displayedContent}</span>
              {isTyping && (
                <span className="animate-[blink_1s_infinite]">|</span>
              )}
            </div>
            {hasHighlight && !isTyping && (
              <div className="mt-[8px] bg-[#fef3c7] px-[8px] py-[4px] rounded-[4px] animate-[fadeIn_0.3s_ease-out]">
                <p className="text-[14px] text-[#333333] whitespace-pre-wrap">
                  {message.highlightedText}
                </p>
              </div>
            )}
            {isTyping && showSkipHint && (
              <p className="text-[11px] text-[#808080] mt-[8px] opacity-60">
                クリックでスキップ
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
}
