"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ChatInputBoxProps {
  onMessageSent?: (message: string) => void;
  onMicrophoneClicked?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInputBox({
  onMessageSent,
  onMicrophoneClicked,
  placeholder = "何でもお聞きください！",
  disabled = false,
}: ChatInputBoxProps) {
  const [message, setMessage] = useState("");

  const sendMessage = useCallback(() => {
    if (message.trim() && !disabled) {
      onMessageSent?.(message.trim());
      setMessage("");
    }
  }, [message, onMessageSent, disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const hasMessage = message.trim().length > 0;

  return (
    <div className="flex items-center gap-[10px] w-full max-w-[710px]">
      {/* Input Container */}
      <div
        className={`flex items-center flex-1 gap-[10px] pl-[15px] pr-[10px] py-[10px] h-[45px] bg-[#ffffff] border border-[#b9b9b9] rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.05)] transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#f4fafb] hover:border-[#8ec5d0] focus-within:bg-[#f4fafb] focus-within:border-[#8ec5d0] ${hasMessage
            ? "border-[#066a9e] shadow-[0_0_0_2px_rgba(6,106,158,0.1)]"
            : ""
          }`}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-[13px] text-[#333333] outline-none border-none bg-transparent placeholder:text-[#808080] disabled:cursor-not-allowed disabled:opacity-50"
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>

      {/* Mic Button */}
      <button
        type="button"
        className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-none border-none transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:enabled:bg-[#f3f4f6] active:enabled:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onMicrophoneClicked?.()}
        aria-label="音声入力"
        disabled={disabled}
      >
        <Image
          src="/assets/icons/mic.svg"
          alt="Mic Icon"
          width={27}
          height={27}
        />
      </button>

      {/* Send Button */}
      <button
        type="button"
        className={`w-[40px] h-[40px] flex items-center justify-center bg-[#066a9e] rounded-full border-none transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${!hasMessage || disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105 hover:shadow-[0_4px_12px_rgba(6,106,158,0.3)] active:scale-95"
          }`}
        onClick={sendMessage}
        disabled={!hasMessage || disabled}
        aria-label="送信"
      >
        <Image
          src="/assets/icons/ai-chat-send.svg"
          alt="Send Icon"
          width={27}
          height={27}
        />
      </button>
    </div>
  );
}
