"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Company, Message, MessageThread } from "../models";
import { MOCK_VENDOR_COMPANIES } from "../mocks/vendor";
import { MESSAGES_MOCK, MESSAGE_THREADS_MOCK } from "../../home/mock/home.data";

interface VendorContextType {
  // Sidebar state
  isCollapsed: boolean;
  toggleSidebar: () => void;

  // Company state
  companies: Company[];
  selectCompany: (companyId: string) => void;

  // Message state
  messages: Message[];
  selectedMessageId: string | null;
  selectMessage: (messageId: string) => void;
  getMessageThread: (messageId: string) => MessageThread | undefined;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMessages: Message[];
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

interface VendorProviderProps {
  children: ReactNode;
}

export function VendorProvider({ children }: VendorProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(MOCK_VENDOR_COMPANIES);
  const [messages, setMessages] = useState<Message[]>(MESSAGES_MOCK);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const selectCompany = useCallback((companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => ({
        ...c,
        isSelected: c.id === companyId,
      }))
    );
  }, []);

  const selectMessage = useCallback((messageId: string) => {
    setSelectedMessageId(messageId);
    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        isSelected: m.id === messageId,
        unreadCount: m.id === messageId ? 0 : m.unreadCount,
      }))
    );
  }, []);

  const getMessageThread = useCallback((messageId: string) => {
    return MESSAGE_THREADS_MOCK.find((t: MessageThread) => t.messageId === messageId);
  }, []);

  const filteredMessages = messages.filter(
    (m) =>
      m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VendorContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        companies,
        selectCompany,
        messages,
        selectedMessageId,
        selectMessage,
        getMessageThread,
        searchQuery,
        setSearchQuery,
        filteredMessages,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error("useVendor must be used within a VendorProvider");
  }
  return context;
}
