"use client";

import { TabNavigation, PageTransition } from "@/shared/components";
import { useCarry } from "./hooks";
import { AddMemberModal, ProjectPlanModal } from "./components";
import { CARRY_TABS, MESSAGE_INPUT_PLACEHOLDER } from "./mock";
import Image from "next/image";

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
      <div className="flex flex-col h-[calc(100vh-90px)] overflow-hidden">
        <TabNavigation tabs={CARRY_TABS} onTabChange={handleTabChange} />

        <div className="flex flex-1 min-h-0 bg-white overflow-hidden">
          {/* Left Panel: Project Header + Vendor Message List */}
          <div className="flex flex-col w-[350px] h-full flex-shrink-0 border-r border-[#e1e1e1] overflow-hidden">
            {/* Project Header */}
            <div className="flex gap-[10px] items-center justify-center w-full h-[85px] p-[10px_15px] border-b border-[#e1e1e1] box-border flex-shrink-0 bg-white">
              <p className="flex-1 font-normal text-[14px] leading-normal text-black m-0 overflow-hidden text-ellipsis [-webkit-box-orient:vertical] whitespace-pre-wrap">
                {projectName}
              </p>
              <button
                type="button"
                className="flex items-center justify-center p-[3px] overflow-hidden flex-shrink-0 bg-transparent border-none cursor-pointer rounded-[4px] transition-colors duration-200 hover:bg-[rgba(6,106,158,0.1)]"
                onClick={() => setShowProjectPlanModal(true)}
              >
                <Image
                  src="/assets/icons/docutment-stack.svg"
                  alt="Project Plan"
                  width={30}
                  height={30}
                />
              </button>
            </div>

            {/* Message List Container */}
            <div className="flex flex-col gap-[10px] h-full w-full py-[15px] bg-[#f5f5f5] overflow-hidden box-border flex-1 min-h-0">
              {/* Title */}
              <p className="font-bold text-[14px] leading-normal text-[#333333] text-center m-0 flex-shrink-0">
                メッセージ一覧
              </p>

              {/* Search Box */}
              <div className="px-[15px] w-full box-border flex-shrink-0">
                <div className="flex items-center p-[7px_15px] bg-white border border-[#8ec0d0] rounded-[1000px] w-full box-border">
                  <Image
                    src="/assets/icons/find-blue.svg"
                    alt="Project Plan"
                    width={20}
                    height={20}
                  />
                  <input
                    type="text"
                    className="flex-1 border-none outline-none bg-transparent text-[14px] text-[#333333] ml-[8px] placeholder:text-[#808080]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Vendor List */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col min-h-0 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#d1d5db] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[#9ca3af]">
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className={`w-full flex gap-[10px] items-start justify-end p-[15px] border-b border-[#e1e1e1] bg-transparent cursor-pointer text-left transition-colors duration-150 hover:bg-[rgba(230,243,245,0.5)] ${
                      selectedVendor?.id === vendor.id ? "bg-white" : ""
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
                    <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
                      <span className="font-bold text-[13px] leading-normal text-[#333333]">
                        {vendor.name}
                      </span>
                      {vendor.lastMessage && (
                        <p className="font-normal text-[13px] leading-normal text-[#333333] m-0 whitespace-pre-wrap">
                          {vendor.lastMessage}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 gap-[5px]">
                      {vendor.lastMessageTime && (
                        <span className="font-normal text-[10px] leading-[19px] text-center text-[#333333]">
                          {vendor.lastMessageTime}
                        </span>
                      )}
                      {(hoveredVendorId === vendor.id ||
                        showVendorMenu === vendor.id) && (
                        <div className="relative">
                          <button
                            type="button"
                            className={`flex items-center justify-center w-[20px] h-[20px] bg-transparent border-none cursor-pointer p-0 rounded-[4px] transition-colors duration-150 hover:bg-[rgba(0,0,0,0.05)] ${
                              showVendorMenu === vendor.id
                                ? "bg-[rgba(0,0,0,0.05)]"
                                : ""
                            }`}
                            onClick={(e) => toggleVendorMenu(e, vendor.id)}
                          >
                            <Image
                              src="/assets/icons/dots-black.svg"
                              alt="Project Plan"
                              width={15}
                              height={2}
                            />
                          </button>
                          {showVendorMenu === vendor.id && (
                            <div className="absolute top-[calc(100%+5px)] right-full mr-[-20px] bg-[#ffffff] rounded-[8px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)] z-[100] overflow-hidden min-w-[100px]">
                              <button
                                type="button"
                                className="flex items-center gap-[8px] p-[10px_15px] bg-transparent border-none cursor-pointer font-normal text-[14px] text-[#333333] text-left w-full whitespace-nowrap hover:bg-[#f5f5f5] [&_svg]:flex-shrink-0"
                                onClick={(e) => handleVendorExit(e, vendor.id)}
                              >
                                <Image
                                  src="/assets/icons/bitcoin-icons-exit-outline.svg"
                                  alt="Exit"
                                  width={25}
                                  height={25}
                                />
                                <span className="text-[#066a9e]">退出</span>
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
          <div className="flex flex-col flex-1 min-w-0 min-h-0 h-full overflow-hidden">
            {selectedVendor ? (
              <div className="flex flex-col flex-1 min-h-0 w-full bg-white overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-[10px_25px] border-b border-[#d9d9d9] flex-shrink-0">
                  <div className="flex items-center gap-[15px]">
                    <p className="font-bold text-[16px] leading-normal text-[#333333] m-0">
                      {selectedVendor.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-[5px]">
                    {/* Member count badge */}
                    <div className="flex items-center justify-center w-[20px] h-[20px] bg-[#066a9e] rounded-full">
                      <span className="font-medium text-[11px] leading-none text-white text-center">
                        {chatMembers.length}
                      </span>
                    </div>
                    {/* Add person icon with dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        className={`flex items-center justify-center bg-transparent border-none cursor-pointer p-0 hover:opacity-80 ${
                          showMemberDropdown ? "opacity-80" : ""
                        }`}
                        onClick={() =>
                          setShowMemberDropdown(!showMemberDropdown)
                        }
                      >
                        <Image
                          src="/assets/icons/person-add.svg"
                          alt="Add person"
                          width={24}
                          height={24}
                        />
                      </button>
                      {/* Member Dropdown Menu */}
                      {showMemberDropdown && (
                        <div className="absolute top-[calc(100%+5px)] right-[-10px] w-[210px] bg-[#ffffff] rounded-[8px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)] z-[100] overflow-hidden">
                          <div className="flex flex-col py-[10px]">
                            <button
                              type="button"
                              className="flex items-center gap-[8px] p-[10px_15px] bg-transparent border-none cursor-pointer font-normal text-[14px] text-[#333333] text-left w-full whitespace-nowrap hover:bg-[#f5f5f5] [&_svg]:flex-shrink-0"
                              onClick={handleOpenAddMemberModal}
                            >
                              <Image
                                src="/assets/icons/ei-plus.svg"
                                alt="Add member"
                                width={25}
                                height={25}
                              />
                              <span className="text-[#066a9e]">
                                メンバーを追加
                              </span>
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-[8px] p-[10px_15px] bg-transparent border-none cursor-pointer font-normal text-[14px] text-[#333333] text-left w-full whitespace-nowrap hover:bg-[#f5f5f5] [&_svg]:flex-shrink-0"
                              onClick={() => {
                                setShowMemberDropdown(false);
                              }}
                            >
                              <Image
                                src="/assets/icons/bitcoin-icons-exit-outline.svg"
                                alt="Exit"
                                width={25}
                                height={25}
                              />
                              <span className="text-[#066a9e]">退出</span>
                            </button>
                          </div>
                          <div className="h-[1px] bg-[#d9d9d9] mx-[15px]"></div>
                          <div className="p-[10px_15px_15px]">
                            <p className="font-normal text-[12px] text-[#808080] m-0 mb-[10px]">
                              メンバー({chatMembers.length})
                            </p>
                            <div className="flex flex-col gap-[8px] max-h-[150px] overflow-y-auto">
                              {chatMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-[10px]"
                                >
                                  <div className="w-[25px] h-[25px] rounded-full bg-[#066a9e] flex items-center justify-center flex-shrink-0">
                                    <span className="font-medium text-[10px] text-white">
                                      {member.initials}
                                    </span>
                                  </div>
                                  <span className="font-normal text-[14px] text-[#333333] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {member.name}
                                  </span>
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
                <div className="flex-1 overflow-y-auto p-[25px] flex flex-col min-h-0 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#d1d5db] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[#9ca3af]">
                  <div className="flex flex-col gap-[10px] w-full">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-[10px] w-full ${
                          msg.sender === "buyer"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {msg.sender === "vendor" && (
                          <div className="w-[25px] h-[25px] rounded-full bg-[#cccccc] flex-shrink-0"></div>
                        )}
                        <div
                          className={`flex flex-col gap-[2px] max-w-[60%] min-w-[200px] ${
                            msg.sender === "buyer" ? "items-end" : ""
                          }`}
                        >
                          {msg.sender === "vendor" && (
                            <p className="font-bold text-[10px] leading-[19px] text-[#333333] m-0">
                              {msg.senderName}
                            </p>
                          )}
                          <div
                            className={`flex items-center justify-center p-[7px] rounded-[4px] w-full box-border border border-[#8ec0d0] ${
                              msg.sender === "buyer"
                                ? "bg-[#e6f3f5]"
                                : "bg-white"
                            }`}
                          >
                            <p className="flex-1 font-normal text-[13px] leading-normal text-[#333333] m-0 whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          </div>
                          <p className="font-normal text-[10px] leading-[19px] text-[#808080] m-0">
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-[15px_25px_25px_25px] flex-shrink-0">
                  <div className="flex items-center justify-between p-[10px_10px_10px_15px] border border-[#b9b9b9] rounded-[4px] w-full box-border">
                    <input
                      type="text"
                      className="flex-1 border-none outline-none bg-transparent font-normal text-[14px] leading-normal text-[#333333] placeholder:text-[#808080]"
                      placeholder={MESSAGE_INPUT_PLACEHOLDER}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="flex items-center justify-center bg-transparent border-none cursor-pointer p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Image
                        src="/assets/icons/vendor-send.svg"
                        alt="Exit"
                        width={25}
                        height={25}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-[10px] h-full w-full">
                <p className="font-normal text-[16px] leading-normal text-[#808080] m-0">
                  ベンダーを選択してください
                </p>
              </div>
            )}
          </div>
        </div>

        <ProjectPlanModal
          isOpen={showProjectPlanModal}
          onClose={() => setShowProjectPlanModal(false)}
        />

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
