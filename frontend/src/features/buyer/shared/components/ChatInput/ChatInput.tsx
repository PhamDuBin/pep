"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ChatInputProps {
  onMessageSent?: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({
  onMessageSent,
  placeholder = "何でもお聞きください！",
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleMessageSend = useCallback(() => {
    if (message.trim()) {
      onMessageSent?.(message.trim());
      setMessage("");
    }
  }, [message, onMessageSent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleMessageSend();
      }
    },
    [handleMessageSend]
  );

  return (
    <div className="flex items-center gap-[10px] w-full max-w-[800px]">
      {/* Input Container */}
      <div className="flex items-center flex-1 gap-[10px] pl-[15px] pr-[10px] py-[10px] h-[45px] bg-[#ffffff] border border-[#b9b9b9] rounded-full shadow-[0px_4px_15px_rgba(0,0,0,0.05)] transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#f4fafb] hover:border-[#8ec5d0] focus-within:bg-[#f4fafb] focus-within:border-[#8ec5d0]">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-[13px] text-[#333333] outline-none border-none bg-transparent placeholder:text-[#808080]"
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Mic Button */}
      <button type="button" className="w-[30px] h-[30px] flex items-center justify-center rounded-full transition-colors duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#f3f4f6]">
        <Image src="/assets/icons/mic.svg" alt="Microphone" width={30} height={30} />
      </button>

      {/* Send Button */}
      <button
        type="button"
        className="transition-opacity duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:opacity-90"
        onClick={handleMessageSend}
      >
        <Image src="/assets/icons/ai-chat-send.svg" alt="Send" width={40} height={40} />
      </button>
    </div>
  );
}
