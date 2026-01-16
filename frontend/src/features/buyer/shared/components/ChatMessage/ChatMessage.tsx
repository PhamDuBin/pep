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
        className={`flex w-full ${isUserMessage ? "justify-end" : "justify-start"} ${message.isNew ? "animate-[slideIn_0.3s_ease-out]" : ""}`}
      >
        {isUserMessage ? (
          <div className="max-w-[70%] bg-[#066a9e] text-[#ffffff] p-[10px] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1),0_2px_4px_-2px_rgb(0_0_0/0.1)]">
            <p className="text-[14px] font-normal leading-[1.5] whitespace-pre-wrap">{displayedContent}</p>
          </div>
        ) : (
          <div className="max-w-[600px] relative cursor-pointer" onClick={skipTyping}>
            <div className="text-[14px] text-[#333333] font-normal leading-[1.5] whitespace-pre-wrap">
              <span>{displayedContent}</span>
              {isTyping && <span className="animate-[blink_1s_infinite]">|</span>}
            </div>
            {hasHighlight && !isTyping && (
              <div className="mt-[8px] bg-[#fef3c7] px-[8px] py-[4px] rounded-[4px] animate-[fadeIn_0.3s_ease-out]">
                <p className="text-[14px] text-[#333333] whitespace-pre-wrap">{message.highlightedText}</p>
              </div>
            )}
            {isTyping && showSkipHint && (
              <p className="text-[11px] text-[#808080] mt-[8px] opacity-60">クリックでスキップ</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // With-avatar variant
  return (
    <div
      className={`flex gap-[12px] w-full animate-[slideIn_0.3s_ease-out] ${isUserMessage ? "justify-end" : ""}`}
    >
      {!isUserMessage && (
        <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 bg-[#066a9e]">
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
        className={`max-w-[70%] px-[16px] py-[12px] rounded-[16px] cursor-pointer text-[14px] leading-[1.625] whitespace-pre-wrap ${isUserMessage ? "bg-[#066a9e] text-[#ffffff] rounded-br-none" : "bg-[#f9fafb] rounded-bl-none"}`}
        onClick={skipTyping}
      >
        <span>{displayedContent}</span>
        {isTyping && <span className="animate-[blink_1s_infinite]">|</span>}
      </div>

      {isUserMessage && (
        <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 bg-[#d1d5db]">
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
