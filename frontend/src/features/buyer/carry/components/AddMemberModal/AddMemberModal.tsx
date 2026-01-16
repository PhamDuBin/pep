"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/shared/components";
import { SearchableUser, ChatMember, AddMemberModalState } from "../../types";

interface AddMemberModalProps {
  isOpen: boolean;
  projectName: string;
  vendorName: string;
  existingMembers: ChatMember[];
  searchResults: SearchableUser[];
  isLoading: boolean;
  isSearching: boolean;
  modalState: AddMemberModalState;
  onClose: () => void;
  onSearch: (query: string) => void;
  onAddMembers: (members: SearchableUser[]) => void;
}

export function AddMemberModal({
  isOpen,
  projectName,
  vendorName,
  existingMembers,
  searchResults,
  isLoading,
  isSearching,
  modalState,
  onClose,
  onSearch,
  onAddMembers,
}: AddMemberModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<SearchableUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reset form when modal opens in search state
  useEffect(() => {
    if (isOpen && modalState === "search") {
      setSearchQuery("");
      setSelectedMembers([]);
      setShowSuggestions(false);
    }
  }, [isOpen, modalState]);

  // Filter out already selected and existing members
  const filteredSearchResults = searchResults.filter((user) => {
    const selectedIds = selectedMembers.map((m) => m.id);
    const existingIds = existingMembers.map((m) => m.id);
    return !selectedIds.includes(user.id) && !existingIds.includes(user.id);
  });

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (value.trim().length > 0) {
        setShowSuggestions(true);
        onSearch(value.trim());
      } else {
        setShowSuggestions(false);
      }
    },
    [onSearch]
  );

  const handleSearchFocus = useCallback(() => {
    if (searchQuery.trim().length > 0 && filteredSearchResults.length > 0) {
      setShowSuggestions(true);
    }
  }, [searchQuery, filteredSearchResults.length]);

  const handleSearchBlur = useCallback(() => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  const selectMember = useCallback((user: SearchableUser) => {
    setSelectedMembers((prev) => {
      if (!prev.find((m) => m.id === user.id)) {
        return [...prev, user];
      }
      return prev;
    });
    setSearchQuery("");
    setShowSuggestions(false);
  }, []);

  const removeMember = useCallback((user: SearchableUser) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== user.id));
  }, []);

  const handleAddMembers = useCallback(() => {
    if (selectedMembers.length > 0) {
      onAddMembers(selectedMembers);
    }
  }, [selectedMembers, onAddMembers]);

  const canAddMembers = selectedMembers.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="メンバーを追加"
      size="md"
      customClass="min-w-[500px] max-w-[500px] [&_.modal-title]:text-[20px] [&_.modal-title]:font-normal [&_.modal-title]:text-[#066a9e]"
      isLoading={isLoading}
      showCloseButton={true}
      allowOverflow={true}
      actions={
        modalState === "search" ? (
          <div className="flex gap-[10px] justify-center items-center">
            <button
              type="button"
              className="py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] text-[14px] font-normal text-[#333] cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0]"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="py-[10px] px-[25px] bg-[#333] border-none rounded-[8px] text-[14px] font-normal text-white cursor-pointer transition-colors duration-200 flex items-center justify-center gap-[8px] min-w-[80px] hover:enabled:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !canAddMembers}
              onClick={handleAddMembers}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "メンバーを追加"
              )}
            </button>
          </div>
        ) : (
          <div className="flex gap-[10px] justify-center items-center">
            <button
              type="button"
              className="py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] text-[14px] font-normal text-[#333] cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0]"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "search" ? (
        <div className="flex flex-col gap-[25px] w-full px-[35px] overflow-visible">
          {/* Project and Vendor Info */}
          <div className="flex flex-col gap-[10px]">
            <div className="flex justify-center gap-[15px]">
              <span className="text-[14px] font-medium min-w-[80px] text-[#000000]">
                プロジェクト名：{projectName}
              </span>
            </div>
            <div className="flex justify-center gap-[15px]">
              <span className="text-[14px] font-medium min-w-[80px] text-[#000000]">
                ベンダー：{vendorName}
              </span>
            </div>
          </div>

          {/* Search Input with Tags Inside */}
          <div className="relative overflow-visible">
            <div className="flex flex-wrap items-center gap-[10px] min-h-[50px] p-[3px_10px] border border-[#b9b9b9] rounded-[4px] bg-white transition-colors duration-200 focus-within:border-[#066a9e]">
              {/* Selected Members Tags (inside input) */}
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-[5px] pr-[10px] bg-transparent border border-[#e1e1e1] rounded-full flex-shrink-0"
                >
                  <div className="w-[30px] h-[30px] rounded-full bg-[#8ec5d0] flex items-center justify-center flex-shrink-0">
                    <span className="font-normal text-[13px] text-white">
                      {member.initials}
                    </span>
                  </div>
                  <span className="text-[14px] font-normal text-[#333] whitespace-nowrap">
                    {member.name}
                  </span>
                  <button
                    type="button"
                    className="flex items-center justify-center w-[24px] h-[24px] p-0 bg-transparent border-none cursor-pointer text-[#808080] transition-colors duration-200 hover:text-[#333]"
                    onClick={() => removeMember(member)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M15 5L5 15M5 5L15 15"
                        stroke="#808080"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {/* Input field */}
              <input
                type="text"
                className="flex-1 min-w-[100px] h-[40px] border-none outline-none bg-transparent text-[16px] font-normal text-[#333] placeholder:text-[#b9b9b9]"
                placeholder={
                  selectedMembers.length === 0
                    ? "名前またはメールアドレスで検索"
                    : ""
                }
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && filteredSearchResults.length > 0 && (
              <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#cfcfcf] rounded-[4px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)] z-[9999] max-h-[200px] overflow-y-auto">
                {filteredSearchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="flex items-center gap-[10px] w-full py-[6px] px-[20px] bg-transparent border-none cursor-pointer text-left hover:bg-[#f5f5f5] first:rounded-t-[4px] last:rounded-b-[4px]"
                    onMouseDown={() => selectMember(user)}
                  >
                    <div className="w-[30px] h-[30px] rounded-full bg-[#8ec5d0] flex items-center justify-center flex-shrink-0">
                      <span className="font-normal text-[13px] text-white">
                        {user.initials}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[2px] min-w-0">
                      <span className="text-[14px] font-medium text-[#333]">
                        {user.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {isSearching && (
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center px-[35px]">
          <p className="text-[14px] font-medium text-[#333] text-center leading-[1.3] m-0">
            メンバーを追加しました。
          </p>
        </div>
      )}
    </Modal>
  );
}
