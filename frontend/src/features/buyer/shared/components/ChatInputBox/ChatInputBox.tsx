"use client";

import { useState, useCallback } from "react";
import styles from "./ChatInputBox.module.scss";

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
    <div className={styles.container}>
      {/* Input Container */}
      <div
        className={`${styles.inputWrapper} ${hasMessage ? styles.focused : ""}`}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>

      {/* Mic Button */}
      <button
        type="button"
        className={styles.micButton}
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
        className={`${styles.sendButton} ${
          !hasMessage || disabled ? styles.disabled : ""
        }`}
        onClick={sendMessage}
        disabled={!hasMessage || disabled}
        aria-label="送信"
      >
        <svg
          className={styles.sendIcon}
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
