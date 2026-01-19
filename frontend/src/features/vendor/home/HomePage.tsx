"use client";

import { PageTransition } from "@/shared/components";
import { useVendorHome } from "./hooks";
import { MessageList, MessageDetail } from "./components";

export function HomePage() {
  const {
    isCollapsed,
    filteredMessages,
    selectedMessageId,
    selectedMessage,
    searchQuery,
    newMessage,
    threadMessages,
    messageContainerRef,
    setSearchQuery,
    setNewMessage,
    handleSelectMessage,
    handleSendMessage,
    handleKeyDown,
  } = useVendorHome();

  return (
    <PageTransition>
      <div
        className={`flex h-[calc(100vh-89px)] bg-white overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
          isCollapsed ? "w-[calc(100vw-60px)]" : "w-[calc(100vw-172px)]"
        }`}
      >
        <MessageList
          messages={filteredMessages}
          selectedMessageId={selectedMessageId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectMessage={handleSelectMessage}
        />

        <MessageDetail
          selectedMessage={selectedMessage}
          threadMessages={threadMessages}
          newMessage={newMessage}
          messageContainerRef={messageContainerRef}
          onNewMessageChange={setNewMessage}
          onSendMessage={handleSendMessage}
          onKeyDown={handleKeyDown}
        />
      </div>
    </PageTransition>
  );
}
