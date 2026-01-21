"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useVendor } from "@/shared/contexts";
import { ThreadMessage } from "../models";
import { sendThreadMessage } from "../services/home.service";

export function useHome() {
  const {
    isCollapsed,
    filteredMessages,
    selectedMessageId,
    selectMessage,
    getMessageThread,
    searchQuery,
    setSearchQuery,
  } = useVendor();

  const [newMessage, setNewMessage] = useState("");
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Get the selected message details
  const selectedMessage = filteredMessages.find((m) => m.id === selectedMessageId);

  // Load thread messages when selection changes
  useEffect(() => {
    if (selectedMessageId) {
      const thread = getMessageThread(selectedMessageId);
      if (thread) {
        setThreadMessages([...thread.messages]);
      }
    }
  }, [selectedMessageId, getMessageThread]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [threadMessages]);

  const handleSelectMessage = useCallback(
    (messageId: string) => {
      selectMessage(messageId);
    },
    [selectMessage]
  );

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedMessageId) return;

    try {
      const message = await sendThreadMessage(selectedMessageId, newMessage.trim());
      setThreadMessages((prev) => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [newMessage, selectedMessageId]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);

  const handleNewMessageChange = useCallback((value: string) => {
    setNewMessage(value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return {
    // State
    isCollapsed,
    filteredMessages,
    selectedMessageId,
    selectedMessage,
    searchQuery,
    newMessage,
    threadMessages,
    messageContainerRef,
    // Actions
    setSearchQuery,
    handleSearchChange,
    handleNewMessageChange,
    handleSelectMessage,
    handleSendMessage,
    handleKeyDown,
  };
}
