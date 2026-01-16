import { AddMemberModalState } from ".";
import {
  ChatMember,
  SearchableUser,
  Tab,
  VendorChatMessage,
  VendorContact,
} from "../models";

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
