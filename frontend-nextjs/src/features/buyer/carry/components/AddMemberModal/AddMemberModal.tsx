"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/components";
import { SearchableUser, ChatMember } from "../../models";
import styles from "./AddMemberModal.module.scss";

export type AddMemberModalState = "search" | "complete";

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
      customClass={styles.addMemberModal}
      isLoading={isLoading}
      showCloseButton={true}
      actions={
        modalState === "search" ? (
          <div className={styles.actionButtons}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              キャンセル
            </button>
            <button
              type="button"
              className={styles.btnAdd}
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
          <div className={styles.actionButtons}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "search" ? (
        <div className={styles.modalContent}>
          {/* Project and Vendor Info */}
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>プロジェクト名：{projectName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>ベンダー：{vendorName}</span>
            </div>
          </div>

          {/* Search Input with Tags Inside */}
          <div className={styles.searchSection}>
            <div className={styles.searchInputContainer}>
              {/* Selected Members Tags (inside input) */}
              {selectedMembers.map((member) => (
                <div key={member.id} className={styles.memberTagInline}>
                  <div className={styles.tagAvatar}>
                    <span>{member.initials}</span>
                  </div>
                  <span className={styles.tagName}>{member.name}</span>
                  <button
                    type="button"
                    className={styles.tagRemove}
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
                className={styles.searchInputInline}
                placeholder={selectedMembers.length === 0 ? "名前またはメールアドレスで検索" : ""}
                value={searchQuery}
                onChange={handleSearchInput}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && filteredSearchResults.length > 0 && (
              <div className={styles.suggestionsDropdown}>
                {filteredSearchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={styles.suggestionItem}
                    onMouseDown={() => selectMember(user)}
                  >
                    <div className={styles.userAvatar}>
                      <span>{user.initials}</span>
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{user.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {isSearching && (
              <div className={styles.searchLoading}>
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.completeContent}>
          <p className={styles.completeMessage}>メンバーを追加しました。</p>
        </div>
      )}
    </Modal>
  );
}
