// =============================================================================
// USE CARRY RETURN MODEL
// =============================================================================

import { ChatMember, SearchableUser } from "./chat-member.model";
import { Tab } from "./tab.model";
import { VendorChatMessage } from "./vendor-chat-message.model";
import { VendorContact } from "./vendor-contact.model";
import { DeleteConfirmModalState } from "@/shared/types";

// Type alias for modal state
type AddMemberModalState = "search" | "complete";

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

  // Delete Member Modal State
  isAdmin: boolean;
  hoveredMemberId: string | null;
  showDeleteMemberModal: boolean;
  memberToDelete: ChatMember | null;
  deleteMemberModalState: DeleteConfirmModalState;
  isDeletingMember: boolean;
  currentUserOrganization: "buyer" | "vendor";

  // Setters
  setNewMessage: (value: string) => void;
  setShowProjectPlanModal: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  setHoveredVendorId: (value: string | null) => void;
  setShowVendorMenu: (value: string | null) => void;
  setShowMemberDropdown: (value: boolean) => void;
  setHoveredMemberId: (value: string | null) => void;

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

  // Delete Member Modal Handlers
  handleDeleteMemberClick: (member: ChatMember) => void;
  handleConfirmDeleteMember: () => void;
  handleCloseDeleteMemberModal: () => void;
}
