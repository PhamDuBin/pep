"use client";

import { useState, useCallback } from "react";

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
        className={`flex items-center flex-1 gap-[10px] pl-[15px] pr-[10px] py-[10px] h-[45px] bg-[#ffffff] border border-[#b9b9b9] rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.05)] transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#f4fafb] hover:border-[#8ec5d0] focus-within:bg-[#f4fafb] focus-within:border-[#8ec5d0] ${hasMessage ? "border-[#066a9e] shadow-[0_0_0_2px_rgba(6,106,158,0.1)]" : ""}`}
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
        <svg
          width="20"
          height="28"
          viewBox="0 0 20 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 0C8.67392 0 7.40215 0.526784 6.46447 1.46447C5.52678 2.40215 5 3.67392 5 5V13C5 14.3261 5.52678 15.5979 6.46447 16.5355C7.40215 17.4732 8.67392 18 10 18C11.3261 18 12.5979 17.4732 13.5355 16.5355C14.4732 15.5979 15 14.3261 15 13V5C15 3.67392 14.4732 2.40215 13.5355 1.46447C12.5979 0.526784 11.3261 0 10 0Z"
            stroke="#333333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 11V13C1 15.3869 1.94821 17.6761 3.63604 19.364C5.32387 21.0518 7.61305 22 10 22C12.3869 22 14.6761 21.0518 16.364 19.364C18.0518 17.6761 19 15.3869 19 13V11"
            stroke="#333333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 22V28"
            stroke="#333333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 28H15"
            stroke="#333333"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Send Button */}
      <button
        type="button"
        className={`w-[40px] h-[40px] flex items-center justify-center bg-[#066a9e] rounded-full border-none transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${!hasMessage || disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-[0_4px_12px_rgba(6,106,158,0.3)] active:scale-95"}`}
        onClick={sendMessage}
        disabled={!hasMessage || disabled}
        aria-label="送信"
      >
        <svg
          className="transition-transform duration-200 ease-out"
          width="15"
          height="19"
          viewBox="0 0 15 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 17V2M7.5 2L1 8.5M7.5 2L14 8.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
