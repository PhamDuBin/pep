"use client";

// =============================================================================
// BUYER CARRY FEATURE HOOK
// =============================================================================

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VendorContact, VendorChatMessage, Tab, ChatMember, SearchableUser } from "../types";
import {
  getVendorContacts,
  getVendorMessages,
  sendMessage as sendMessageService,
} from "../services/carry.service";
import { MEMBERS_MOCK, SEARCHABLE_USERS_MOCK, CURRENT_PROJECT_NAME_MOCK } from "../mock";
import type { AddMemberModalState } from "../components/AddMemberModal";

export interface UseCarryReturn {
  // State
  vendors: VendorContact[];
  selectedVendor: VendorContact | null;
  messages: VendorChatMessage[];
  newMessage: string;
  showProjectPlanModal: boolean;
  searchQuery: string;
  hoveredVendorId: string | null;
  showVendorMenu: string | null;
  showMemberDropdown: boolean;
  filteredVendors: VendorContact[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;

  // Add Member Modal State
  showAddMemberModal: boolean;
  addMemberModalState: AddMemberModalState;
  chatMembers: ChatMember[];
  searchResults: SearchableUser[];
  isAddingMembers: boolean;
  isSearchingMembers: boolean;
  projectName: string;

  // Setters
  setNewMessage: (value: string) => void;
  setShowProjectPlanModal: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  setHoveredVendorId: (value: string | null) => void;
  setShowVendorMenu: (value: string | null) => void;
  setShowMemberDropdown: (value: boolean) => void;

  // Handlers
  handleTabChange: (tab: Tab) => void;
  handleVendorSelect: (vendor: VendorContact) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  toggleVendorMenu: (e: React.MouseEvent, vendorId: string) => void;
  handleVendorExit: (e: React.MouseEvent, vendorId: string) => void;

  // Add Member Modal Handlers
  handleOpenAddMemberModal: () => void;
  handleCloseAddMemberModal: () => void;
  handleSearchMembers: (query: string) => void;
  handleAddMembers: (members: SearchableUser[]) => void;
}

export function useCarry(): UseCarryReturn {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [vendors, setVendors] = useState<VendorContact[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorContact | null>(null);
  const [messages, setMessages] = useState<VendorChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showProjectPlanModal, setShowProjectPlanModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredVendorId, setHoveredVendorId] = useState<string | null>(null);
  const [showVendorMenu, setShowVendorMenu] = useState<string | null>(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberModalState, setAddMemberModalState] = useState<AddMemberModalState>("search");
  const [chatMembers, setChatMembers] = useState<ChatMember[]>(MEMBERS_MOCK);
  const [searchResults, setSearchResults] = useState<SearchableUser[]>([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  const projectName = CURRENT_PROJECT_NAME_MOCK;

  // Load vendors on mount
  useEffect(() => {
    const loadVendors = async () => {
      const vendorList = await getVendorContacts();
      setVendors(vendorList);
    };
    loadVendors();
  }, []);

  // Load messages when vendor is selected
  useEffect(() => {
    if (selectedVendor) {
      const loadMessages = async () => {
        const vendorMessages = await getVendorMessages(selectedVendor.id);
        setMessages(vendorMessages);
      };
      loadMessages();
    }
  }, [selectedVendor]);

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = useCallback(
    (tab: Tab) => {
      if (tab.id === "kick") {
        router.push("/buyer/ai-chat");
      }
    },
    [router]
  );

  const handleVendorSelect = useCallback((vendor: VendorContact) => {
    setSelectedVendor(vendor);
    setVendors((prev) =>
      prev.map((v) => ({ ...v, isSelected: v.id === vendor.id }))
    );
    setShowVendorMenu(null);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedVendor) return;

    try {
      const response = await sendMessageService(
        selectedVendor.id,
        newMessage.trim()
      );
      if (response.success) {
        setMessages((prev) => [...prev, response.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [newMessage, selectedVendor]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const toggleVendorMenu = useCallback((e: React.MouseEvent, vendorId: string) => {
    e.stopPropagation();
    setShowVendorMenu((prev) => (prev === vendorId ? null : vendorId));
  }, []);

  const handleVendorExit = useCallback((e: React.MouseEvent, vendorId: string) => {
    e.stopPropagation();
    console.log("Exit vendor:", vendorId);
    setShowVendorMenu(null);
  }, []);

  // Add Member Modal Handlers
  const handleOpenAddMemberModal = useCallback(() => {
    setShowMemberDropdown(false);
    setAddMemberModalState("search");
    setSearchResults([]);
    setShowAddMemberModal(true);
  }, []);

  const handleCloseAddMemberModal = useCallback(() => {
    setShowAddMemberModal(false);
    setAddMemberModalState("search");
    setSearchResults([]);
  }, []);

  const handleSearchMembers = useCallback((query: string) => {
    setIsSearchingMembers(true);
    // Simulate API search with mock data
    setTimeout(() => {
      const results = SEARCHABLE_USERS_MOCK.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearchingMembers(false);
    }, 300);
  }, []);

  const handleAddMembers = useCallback((members: SearchableUser[]) => {
    setIsAddingMembers(true);
    // Simulate API call
    setTimeout(() => {
      const newMembers: ChatMember[] = members.map((m) => ({
        id: m.id,
        name: m.name,
        initials: m.initials,
      }));
      setChatMembers((prev) => [...prev, ...newMembers]);
      setIsAddingMembers(false);
      setAddMemberModalState("complete");
    }, 500);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    // State
    vendors,
    selectedVendor,
    messages,
    newMessage,
    showProjectPlanModal,
    searchQuery,
    hoveredVendorId,
    showVendorMenu,
    showMemberDropdown,
    filteredVendors,
    messagesEndRef,

    // Add Member Modal State
    showAddMemberModal,
    addMemberModalState,
    chatMembers,
    searchResults,
    isAddingMembers,
    isSearchingMembers,
    projectName,

    // Setters
    setNewMessage,
    setShowProjectPlanModal,
    setSearchQuery,
    setHoveredVendorId,
    setShowVendorMenu,
    setShowMemberDropdown,

    // Handlers
    handleTabChange,
    handleVendorSelect,
    handleSendMessage,
    handleKeyDown,
    toggleVendorMenu,
    handleVendorExit,

    // Add Member Modal Handlers
    handleOpenAddMemberModal,
    handleCloseAddMemberModal,
    handleSearchMembers,
    handleAddMembers,
  };
}
