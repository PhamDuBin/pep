"use client";

import { TabNavigation, Modal, PageTransition } from "@/components";
import { useCarry } from "./hooks";
import { AddMemberModal } from "./components";
import {
  CARRY_TABS,
  MESSAGE_INPUT_PLACEHOLDER,
} from "./mock";
import styles from "./CarryPage.module.scss";

export function CarryPage() {
  const {
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
  } = useCarry();

  return (
    <PageTransition>
      <div className={styles.container}>
        <TabNavigation tabs={CARRY_TABS} onTabChange={handleTabChange} />

        <div className={styles.contentArea}>
          {/* Left Panel: Project Header + Vendor Message List */}
          <div className={styles.leftPanel}>
            {/* Project Header */}
            <div className={styles.projectHeader}>
              <p className={styles.projectName}>{projectName}</p>
              <button
                type="button"
                className={styles.documentIcon}
                onClick={() => setShowProjectPlanModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25 20.7144V6.42868C25 5.67091 24.699 4.94419 24.1632 4.40837C23.6274 3.87255 22.9007 3.57153 22.1429 3.57153H10.7143C9.95656 3.57153 9.22983 3.87255 8.69402 4.40837C8.1582 4.94419 7.85718 5.67091 7.85718 6.42868V20.7144C7.85718 21.4722 8.1582 22.1989 8.69402 22.7347C9.22983 23.2705 9.95656 23.5715 10.7143 23.5715H22.1429C22.9007 23.5715 23.6274 23.2705 24.1632 22.7347C24.699 22.1989 25 21.4722 25 20.7144Z"
                    stroke="#066A9E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5786 7.05005L4.71574 8.09291C4.00391 8.35218 3.4242 8.88354 3.10406 9.57015C2.78393 10.2568 2.74959 11.0424 3.0086 11.7543L7.89431 25.1786C8.02268 25.5313 8.21926 25.8551 8.47283 26.1318C8.72639 26.4084 9.03197 26.6324 9.37211 26.7909C9.71225 26.9495 10.0803 27.0394 10.4552 27.0557C10.8301 27.072 11.2046 27.0142 11.5572 26.8858L19.5115 23.7458M12.1429 10.7143H19.2857M12.1429 13.5715H20.7143M12.1429 16.4286H16.4286"
                    stroke="#066A9E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Message List Container */}
            <div className={styles.messageListContainer}>
              {/* Title */}
              <p className={styles.listTitle}>メッセージ一覧</p>

              {/* Search Box */}
              <div className={styles.searchWrapper}>
                <div className={styles.searchBox}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M19.0337 19.8332C19.5512 20.3478 20.3498 19.5535 19.8324 19.0501L15.6139 14.8441C17.094 13.2162 17.9121 11.0989 17.9088 8.90424C17.9088 3.99348 13.8928 0 8.95438 0C4.01597 0 0 3.99348 0 8.90424C0 13.815 4.01597 17.8085 8.95438 17.8085C11.1817 17.8085 13.2403 16.9919 14.8152 15.6383L19.0337 19.8332ZM1.1238 8.90424C1.1238 4.60873 4.6448 1.11862 8.95326 1.11862C13.273 1.11862 16.7827 4.60873 16.7827 8.90424C16.7827 13.1998 13.273 16.6899 8.95326 16.6899C4.6448 16.6899 1.1238 13.1998 1.1238 8.90424Z"
                      fill="#066A9E"
                    />
                  </svg>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Vendor List */}
              <div className={styles.vendorList}>
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className={`${styles.vendorItem} ${
                      selectedVendor?.id === vendor.id ? styles.selected : ""
                    }`}
                    onClick={() => handleVendorSelect(vendor)}
                    onMouseEnter={() => setHoveredVendorId(vendor.id)}
                    onMouseLeave={() => {
                      setHoveredVendorId(null);
                      if (showVendorMenu !== vendor.id) {
                        setShowVendorMenu(null);
                      }
                    }}
                  >
                    <div className={styles.vendorContent}>
                      <span className={styles.vendorName}>{vendor.name}</span>
                      {vendor.lastMessage && (
                        <p className={styles.lastMessage}>{vendor.lastMessage}</p>
                      )}
                    </div>
                    <div className={styles.rightSection}>
                      {vendor.lastMessageTime && (
                        <span className={styles.timestamp}>{vendor.lastMessageTime}</span>
                      )}
                      {(hoveredVendorId === vendor.id || showVendorMenu === vendor.id) && (
                        <div className={styles.menuContainer}>
                          <button
                            type="button"
                            className={`${styles.menuBtn} ${
                              showVendorMenu === vendor.id ? styles.active : ""
                            }`}
                            onClick={(e) => toggleVendorMenu(e, vendor.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="3"
                              viewBox="0 0 16 3"
                              fill="none"
                            >
                              <path
                                d="M8.98438 1.17188C8.98438 1.40365 8.91565 1.63022 8.78688 1.82293C8.65811 2.01565 8.47509 2.16585 8.26096 2.25455C8.04683 2.34324 7.8112 2.36645 7.58388 2.32123C7.35656 2.27602 7.14775 2.16441 6.98386 2.00052C6.81997 1.83663 6.70836 1.62782 6.66314 1.4005C6.61793 1.17317 6.64113 0.93755 6.72983 0.723418C6.81853 0.509286 6.96873 0.326264 7.16144 0.197496C7.35416 0.068729 7.58073 0 7.8125 0C8.1233 0 8.42137 0.123465 8.64114 0.343234C8.86091 0.563003 8.98438 0.861075 8.98438 1.17188ZM14.4531 0C14.2213 0 13.9948 0.068729 13.8021 0.197496C13.6094 0.326264 13.4592 0.509286 13.3705 0.723418C13.2818 0.93755 13.2585 1.17317 13.3038 1.4005C13.349 1.62782 13.4606 1.83663 13.6245 2.00052C13.7884 2.16441 13.9972 2.27602 14.2245 2.32123C14.4518 2.36645 14.6874 2.34324 14.9016 2.25455C15.1157 2.16585 15.2987 2.01565 15.4275 1.82293C15.5563 1.63022 15.625 1.40365 15.625 1.17188C15.625 0.861075 15.5015 0.563003 15.2818 0.343234C15.062 0.123465 14.7639 0 14.4531 0ZM1.17188 0C0.940101 0 0.713531 0.068729 0.520817 0.197496C0.328103 0.326264 0.177901 0.509286 0.0892042 0.723418C0.000507757 0.93755 -0.0226993 1.17317 0.0225178 1.4005C0.0677348 1.62782 0.179345 1.83663 0.343235 2.00052C0.507124 2.16441 0.715933 2.27602 0.943254 2.32123C1.17058 2.36645 1.4062 2.34324 1.62033 2.25455C1.83446 2.16585 2.01749 2.01565 2.14625 1.82293C2.27502 1.63022 2.34375 1.40365 2.34375 1.17188C2.34375 0.861075 2.22029 0.563003 2.00052 0.343234C1.78075 0.123465 1.48268 0 1.17188 0Z"
                                fill="#333333"
                              />
                            </svg>
                          </button>
                          {showVendorMenu === vendor.id && (
                            <div className={styles.dropdownMenu}>
                              <button
                                type="button"
                                className={styles.dropdownItem}
                                onClick={(e) => handleVendorExit(e, vendor.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                >
                                  <path
                                    d="M4.16667 17.5C3.70833 17.5 3.31597 17.3369 2.98958 17.0106C2.66319 16.6842 2.5 16.2917 2.5 15.8333V4.16667C2.5 3.70833 2.66319 3.31583 2.98958 2.98917C3.31597 2.66306 3.70833 2.5 4.16667 2.5H10V4.16667H4.16667V15.8333H10V17.5H4.16667ZM13.3333 14.1667L12.1875 12.9583L14.3125 10.8333H7.5V9.16667H14.3125L12.1875 7.04167L13.3333 5.83333L17.5 10L13.3333 14.1667Z"
                                    fill="#066A9E"
                                  />
                                </svg>
                                <span className={styles.exitText}>退出</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Chat Area */}
          <div className={styles.rightPanel}>
            {selectedVendor ? (
              <div className={styles.chatContainer}>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                  <div className={styles.headerLeft}>
                    <p className={styles.chatVendorName}>{selectedVendor.name}</p>
                  </div>
                  <div className={styles.headerRight}>
                    {/* Member count badge */}
                    <div className={styles.memberBadge}>
                      <span className={styles.memberCount}>{chatMembers.length}</span>
                    </div>
                    {/* Add person icon with dropdown */}
                    <div className={styles.addPersonContainer}>
                      <button
                        type="button"
                        className={`${styles.addPersonBtn} ${
                          showMemberDropdown ? styles.active : ""
                        }`}
                        onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18.25 10.5H15.75C15.608 10.5 15.4893 10.452 15.394 10.356C15.2987 10.26 15.2507 10.141 15.25 9.99901C15.2493 9.85701 15.2973 9.73835 15.394 9.64301C15.4907 9.54768 15.6093 9.50001 15.75 9.50001H18.25V7.00001C18.25 6.85801 18.298 6.73935 18.394 6.64401C18.49 6.54868 18.609 6.50068 18.751 6.50001C18.893 6.49935 19.0117 6.54735 19.107 6.64401C19.2023 6.74068 19.25 6.85935 19.25 7.00001V9.50001H21.75C21.892 9.50001 22.0107 9.54801 22.106 9.64401C22.2013 9.74001 22.2493 9.85901 22.25 10.001C22.2507 10.143 22.2027 10.2617 22.106 10.357C22.0093 10.4523 21.8907 10.5 21.75 10.5H19.25V13C19.25 13.142 19.202 13.2607 19.106 13.356C19.01 13.4513 18.891 13.4993 18.749 13.5C18.607 13.5007 18.4883 13.4527 18.393 13.356C18.2977 13.2593 18.25 13.1407 18.25 13V10.5ZM9 11.385C8.17533 11.385 7.469 11.091 6.881 10.503C6.293 9.91501 5.99933 9.20901 6 8.38501C6.00067 7.56101 6.29433 6.85435 6.881 6.26501C7.46767 5.67568 8.174 5.38268 9 5.38601C9.826 5.38935 10.5323 5.68268 11.119 6.26601C11.7057 6.84935 11.9993 7.55601 12 8.38601C12.0007 9.21601 11.707 9.92201 11.119 10.504C10.531 11.086 9.82467 11.3797 9 11.385ZM2 17.577V16.969C2 16.5563 2.12 16.1703 2.36 15.811C2.60067 15.451 2.924 15.1717 3.33 14.973C4.274 14.5203 5.21867 14.181 6.164 13.955C7.10867 13.7283 8.054 13.615 9 13.615C9.946 13.615 10.8917 13.7283 11.837 13.955C12.7823 14.1817 13.7263 14.521 14.669 14.973C15.0757 15.1717 15.399 15.451 15.639 15.811C15.8797 16.1703 16 16.5563 16 16.969V17.577C16 17.8703 15.9003 18.117 15.701 18.317C15.5017 18.5157 15.255 18.615 14.961 18.615H3.04C2.746 18.615 2.49933 18.5153 2.3 18.316C2.10067 18.1167 2.00067 17.8703 2 17.577ZM3 17.616H15V16.969C15 16.7477 14.9283 16.5393 14.785 16.344C14.6423 16.1493 14.4447 15.9847 14.192 15.85C13.3693 15.4513 12.521 15.146 11.647 14.934C10.773 14.722 9.89067 14.616 9 14.616C8.10933 14.616 7.22733 14.722 6.354 14.934C5.48067 15.146 4.632 15.4513 3.808 15.85C3.55467 15.9847 3.357 16.1493 3.215 16.344C3.07167 16.5393 3 16.748 3 16.97V17.616ZM9 10.385C9.55 10.385 10.021 10.189 10.413 9.79701C10.805 9.40501 11.0007 8.93401 11 8.38401C10.9993 7.83401 10.8037 7.36335 10.413 6.97201C10.0223 6.58068 9.55133 6.38468 9 6.38401C8.44867 6.38335 7.978 6.57935 7.588 6.97201C7.198 7.36468 7.002 7.83535 7 8.38401C6.998 8.93268 7.194 9.40368 7.588 9.79701C7.982 10.1903 8.45267 10.386 9 10.384"
                            fill="#066A9E"
                          />
                        </svg>
                      </button>
                      {/* Member Dropdown Menu */}
                      {showMemberDropdown && (
                        <div className={styles.memberDropdown}>
                          <div className={styles.dropdownActions}>
                            <button
                              type="button"
                              className={`${styles.dropdownItem} ${styles.action}`}
                              onClick={handleOpenAddMemberModal}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                                fill="none"
                              >
                                <path
                                  d="M12.5 21C7.8 21 4 17.2 4 12.5C4 7.8 7.8 4 12.5 4C17.2 4 21 7.8 21 12.5C21 17.2 17.2 21 12.5 21ZM12.5 5C8.35 5 5 8.35 5 12.5C5 16.65 8.35 20 12.5 20C16.65 20 20 16.65 20 12.5C20 8.35 16.65 5 12.5 5Z"
                                  fill="#066A9E"
                                />
                                <path d="M8 12H17V13H8V12Z" fill="#066A9E" />
                                <path d="M12 8H13V17H12V8Z" fill="#066A9E" />
                              </svg>
                              <span className={styles.actionText}>メンバーを追加</span>
                            </button>
                            <button
                              type="button"
                              className={`${styles.dropdownItem} ${styles.action}`}
                              onClick={() => {
                                console.log("Exit chat");
                                setShowMemberDropdown(false);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                                fill="none"
                              >
                                <path
                                  d="M20.0884 12.5001H11.7425M17.1978 16.2876L20.8332 12.5001L17.1978 8.71258M14.0155 7.29175V4.16675H4.1665V20.8334H14.0155V17.7084"
                                  stroke="#066A9E"
                                  strokeWidth="1.04167"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className={styles.actionText}>退出</span>
                            </button>
                          </div>
                          <div className={styles.dropdownDivider}></div>
                          <div className={styles.membersSection}>
                            <p className={styles.membersLabel}>メンバー({chatMembers.length})</p>
                            <div className={styles.membersList}>
                              {chatMembers.map((member) => (
                                <div key={member.id} className={styles.memberItem}>
                                  <div className={styles.memberAvatar}>
                                    <span>{member.initials}</span>
                                  </div>
                                  <span className={styles.memberName}>{member.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className={styles.messagesArea}>
                  <div className={styles.messagesContent}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${styles.messageRow} ${
                          msg.sender === "buyer" ? styles.buyer : styles.vendor
                        }`}
                      >
                        {msg.sender === "vendor" && <div className={styles.avatar}></div>}
                        <div className={styles.messageContentWrapper}>
                          {msg.sender === "vendor" && (
                            <p className={styles.senderName}>{msg.senderName}</p>
                          )}
                          <div
                            className={`${styles.messageBubble} ${
                              msg.sender === "buyer" ? styles.buyer : styles.vendor
                            }`}
                          >
                            <p className={styles.messageText}>{msg.content}</p>
                          </div>
                          <p className={styles.messageTime}>{msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Chat Input */}
                <div className={styles.chatInputWrapper}>
                  <div className={styles.chatInputBox}>
                    <input
                      type="text"
                      className={styles.messageInput}
                      placeholder={MESSAGE_INPUT_PLACEHOLDER}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className={styles.sendButton}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M19.502 9.375L0.175781 17.998L2.32422 9.375L0.175781 0.751953L19.502 9.375ZM2.01172 2.93945L3.4668 8.7793H15.0879L2.01172 2.93945ZM3.44727 10.0293L2.01172 15.8105L14.9707 10.0293H3.44727Z"
                          fill="#066A9E"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyMessage}>ベンダーを選択してください</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Plan Modal */}
        <Modal
          isOpen={showProjectPlanModal}
          onClose={() => setShowProjectPlanModal(false)}
          title="プロジェクト計画書"
          size="lg"
          customClass={styles.projectPlanModal}
          actions={
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.btnClose}
                onClick={() => setShowProjectPlanModal(false)}
              >
                閉じる
              </button>
            </div>
          }
        >
          <div className={styles.projectPlanContent}>
            {/* PDF Preview Section */}
            <div className={styles.pdfPreviewContainer}>
              <div className={styles.pdfPreviewItem}>
                <img src="/pictures/pic1.jpg" alt="PDF Preview" />
              </div>
              <div className={styles.pdfPreviewItem}>
                <img src="/pictures/pic2.jpg" alt="PDF Preview" />
              </div>
            </div>
          </div>
        </Modal>

        {/* Add Member Modal */}
        <AddMemberModal
          isOpen={showAddMemberModal}
          projectName={projectName}
          vendorName={selectedVendor?.name ?? ""}
          existingMembers={chatMembers}
          searchResults={searchResults}
          isLoading={isAddingMembers}
          isSearching={isSearchingMembers}
          modalState={addMemberModalState}
          onClose={handleCloseAddMemberModal}
          onSearch={handleSearchMembers}
          onAddMembers={handleAddMembers}
        />
      </div>
    </PageTransition>
  );
}
