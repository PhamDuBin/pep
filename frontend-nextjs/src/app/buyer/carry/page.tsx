"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TabNavigation, Modal } from "@/components";
import {
  MOCK_VENDOR_CONTACTS,
  MOCK_VENDOR_CHAT_MESSAGES,
  CURRENT_PROJECT_NAME,
  MESSAGE_INPUT_PLACEHOLDER,
} from "@/mocks";
import { Tab, VendorContact, VendorChatMessage } from "@/types";
import styles from "./page.module.scss";

const CARRY_TABS: Tab[] = [
  {
    id: "kick",
    label: "kick",
    subLabel: "(AI Chat)",
    icon: "kick",
    isActive: false,
    isDisabled: false,
  },
  {
    id: "carry",
    label: "carry",
    subLabel: "(コミュニケーション)",
    icon: "carry",
    isActive: true,
    isDisabled: false,
  },
];

export default function CarryPage() {
  const router = useRouter();

  const [vendors, setVendors] = useState<VendorContact[]>(MOCK_VENDOR_CONTACTS);
  const [selectedVendor, setSelectedVendor] = useState<VendorContact | null>(
    null
  );
  const [messages, setMessages] = useState<VendorChatMessage[]>(
    MOCK_VENDOR_CHAT_MESSAGES
  );
  const [newMessage, setNewMessage] = useState("");
  const [showProjectPlanModal, setShowProjectPlanModal] = useState(false);

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
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedVendor) return;

    const message: VendorChatMessage = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      timestamp: new Date().toLocaleString("ja-JP", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "buyer",
      senderName: "山田 太郎",
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  }, [newMessage, selectedVendor]);

  return (
    <div className={styles.container}>
      <TabNavigation tabs={CARRY_TABS} onTabChange={handleTabChange} />

      <div className={styles.contentArea}>
        {/* Left Panel: Vendor List */}
        <div className={styles.leftPanel}>
          {/* Project Header */}
          <div className={styles.projectHeader}>
            <p className={styles.projectName}>{CURRENT_PROJECT_NAME}</p>
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

          {/* Vendor List */}
          <div className={styles.vendorList}>
            <div className={styles.vendorListHeader}>
              <span>メッセージ一覧</span>
            </div>
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className={`${styles.vendorItem} ${
                  selectedVendor?.id === vendor.id ? styles.selected : ""
                }`}
                onClick={() => handleVendorSelect(vendor)}
              >
                <div className={styles.vendorAvatar}>
                  {vendor.name.charAt(0)}
                </div>
                <div className={styles.vendorInfo}>
                  <span className={styles.vendorName}>{vendor.name}</span>
                  <span className={styles.vendorLastMessage}>
                    {vendor.lastMessage}
                  </span>
                </div>
                <span className={styles.vendorTime}>
                  {vendor.lastMessageTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Chat Area */}
        <div className={styles.rightPanel}>
          {selectedVendor ? (
            <>
              {/* Chat Header */}
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderInfo}>
                  <span className={styles.chatVendorName}>
                    {selectedVendor.name}
                  </span>
                  <span className={styles.chatMemberCount}>メンバー: 3</span>
                </div>
                <div className={styles.chatHeaderActions}>
                  <button type="button" className={styles.addMemberBtn}>
                    メンバー追加
                  </button>
                  <button type="button" className={styles.exitChatBtn}>
                    退出
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className={styles.chatMessages}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.chatMessage} ${
                      msg.sender === "buyer"
                        ? styles.buyerMessage
                        : styles.vendorMessage
                    }`}
                  >
                    <div className={styles.messageAvatar}>
                      {msg.senderName.charAt(0)}
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageMeta}>
                        <span className={styles.senderName}>
                          {msg.senderName}
                        </span>
                        <span className={styles.messageTime}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className={styles.messageText}>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className={styles.chatInput}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={MESSAGE_INPUT_PLACEHOLDER}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <svg
                    width="15"
                    height="19"
                    viewBox="0 0 15 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 17V2M7.5 2L1 8.5M7.5 2L14 8.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noVendorSelected}>
              <p>ベンダーを選択してください</p>
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
      >
        <div className={styles.projectPlanContent}>
          <h3>AIを利用した花屋の業務効率化</h3>
          <p>プロジェクト計画書の内容がここに表示されます。</p>
        </div>
      </Modal>
    </div>
  );
}
