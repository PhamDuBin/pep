"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import styles from "./ChatInput.module.scss";

interface ChatInputProps {
  onMessageSent?: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({
  onMessageSent,
  placeholder = "何でもお聞きください！",
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const sendMessage = useCallback(() => {
    if (message.trim()) {
      onMessageSent?.(message.trim());
      setMessage("");
    }
  }, [message, onMessageSent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className={styles.container}>
      {/* Input Container */}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Mic Button */}
      <button type="button" className={styles.micButton}>
        <Image src="/icons/mic.svg" alt="Microphone" width={30} height={30} />
      </button>

      {/* Send Button */}
      <button
        type="button"
        className={styles.sendButton}
        onClick={sendMessage}
      >
        <Image src="/icons/send.svg" alt="Send" width={40} height={40} />
      </button>
    </div>
  );
}
