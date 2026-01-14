"use client";

import Image from "next/image";
import { useVendorHome } from "./hooks";
import styles from "./VendorHomePage.module.scss";

export function VendorHomePage() {
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
    <div
      className={`${styles.container} ${isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}
    >
      {/* Message List Panel */}
      <div className={styles.messageListPanel}>
        {/* Header */}
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>全てのメッセージ一覧</h2>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.7555 18.6065L16.3182 15.2458C17.7011 13.6129 18.4945 11.5329 18.4945 9.29776C18.4945 4.16878 14.3259 0 9.19679 0C4.06766 0 -0.100952 4.16878 -0.100952 9.29776C-0.100952 14.4267 4.06766 18.5955 9.19679 18.5955C11.2924 18.5955 13.2501 17.8915 14.8371 16.6461L18.3102 20.0452C18.5707 20.2946 18.9089 20.4194 19.2328 20.4194C19.5425 20.4194 19.8664 20.3089 20.1198 20.0738C20.6551 19.5741 20.6836 18.7414 20.1838 18.2062L19.7555 18.6065ZM9.19679 2.01392C13.2145 2.01392 16.4806 5.27994 16.4806 9.29776C16.4806 13.3156 13.2145 16.5816 9.19679 16.5816C5.17897 16.5816 1.91295 13.3156 1.91295 9.29776C1.91295 5.27994 5.17897 2.01392 9.19679 2.01392Z"
                fill="#066A9E"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              placeholder="検索..."
            />
          </div>
        </div>

        {/* Message Items */}
        <div className={styles.messageItems}>
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageItem} ${message.id === selectedMessageId ? styles.selected : ""}`}
              onClick={() => handleSelectMessage(message.id)}
            >
              <div className={styles.messageContent}>
                <div className={styles.companyName}>{message.companyName}</div>
                <p className={styles.messagePreview}>{message.preview}</p>
              </div>
              <div className={styles.messageMeta}>
                <span className={styles.messageTime}>{message.timestamp}</span>
                {message.unreadCount > 0 && (
                  <div className={styles.unreadBadge}>{message.unreadCount}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail Panel */}
      <div className={styles.messageDetailPanel}>
        {!selectedMessageId ? (
          <div className={styles.emptyState}>
            <p>バイヤーを選択してください</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className={styles.detailHeader}>
              <div className={styles.headerInfo}>
                <h2 className={styles.companyTitle}>{selectedMessage?.companyName}</h2>
                <div className={styles.projectBadge}>
                  <span>{selectedMessage?.projectName}</span>
                </div>
              </div>
              <div className={styles.documentIcon}>
                <Image
                  src="/assets/icons/vendor-docutment-stack.svg"
                  alt="Documents"
                  width={29}
                  height={30}
                />
              </div>
            </div>

            {/* Message Thread */}
            <div className={styles.messageThread} ref={messageContainerRef}>
              {threadMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.threadMessage} ${msg.isFromUser ? styles.fromUser : styles.fromOther}`}
                >
                  {!msg.isFromUser && <div className={styles.otherAvatar} />}
                  <div className={styles.messageWrapper}>
                    <div
                      className={`${styles.messageBubble} ${msg.isFromUser ? styles.userBubble : styles.otherBubble}`}
                    >
                      <p>{msg.content}</p>
                    </div>
                    <span className={styles.messageTimestamp}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className={styles.messageInputContainer}>
              <div className={styles.messageInputBox}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="メッセージを入力"
                  className={styles.messageInput}
                />
                <button
                  type="button"
                  className={styles.sendButton}
                  onClick={handleSendMessage}
                >
                  <Image
                    src="/assets/icons/vendor-send.svg"
                    alt="Send"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
