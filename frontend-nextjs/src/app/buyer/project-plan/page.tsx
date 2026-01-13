"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TabNavigation,
  ChatMessageList,
  ChatInputBox,
  PdfPreview,
  Modal,
  PageTransition,
} from "@/components";
import {
  MOCK_PDF_PAGES,
  MOCK_VENDORS,
  PROJECT_PLAN_AI_RESPONSE,
  MODE_DESCRIPTION,
  CHAT_INPUT_PLACEHOLDER,
} from "@/mocks/project-plan";
import { Tab, ChatMessage, Vendor } from "@/types";

// Tab configuration for project-plan page (matches Angular)
const PROJECT_PLAN_TABS: Tab[] = [
  {
    id: "kick",
    label: "kick",
    subLabel: "(AI Chat)",
    icon: "kick",
    isActive: true,
    isDisabled: false,
  },
  {
    id: "carry",
    label: "carry",
    subLabel: "(コミュニケーション)",
    icon: "carry",
    isActive: false,
    isDisabled: false,
  },
];
import styles from "./page.module.scss";

export default function ProjectPlanPage() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "ppt">("pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showRfpConfirmModal, setShowRfpConfirmModal] = useState(false);
  const [showVendorSelectionModal, setShowVendorSelectionModal] =
    useState(false);
  const [showRfpSentModal, setShowRfpSentModal] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [sentVendors, setSentVendors] = useState<Vendor[]>([]);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [isSendingRfp, setIsSendingRfp] = useState(false);

  // Filter vendors based on search query
  const filteredVendors = vendorSearchQuery.trim()
    ? vendors.filter((v) =>
        v.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
      )
    : vendors;

  // Count selected vendors
  const selectedVendorCount = vendors.filter((v) => v.isSelected).length;

  // Split sent vendors into rows of 2
  const sentVendorRows = useMemo(() => {
    const rows: Vendor[][] = [];
    const itemsPerRow = 2;
    for (let i = 0; i < sentVendors.length; i += itemsPerRow) {
      rows.push(sentVendors.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [sentVendors]);

  const scrollToBottom = useCallback(() => {
    const element = scrollContainerRef.current;
    if (element) {
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (showPdfPreview) {
      scrollToBottom();
    }
  }, [showPdfPreview, scrollToBottom]);

  const handleTabChange = useCallback(
    (tab: Tab) => {
      if (tab.id === "carry") {
        router.push("/buyer/carry");
      }
    },
    [router]
  );

  const handleMessageSent = useCallback((message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      timestamp: new Date(),
      sender: "user",
      isNew: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response with project plan
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: PROJECT_PLAN_AI_RESPONSE,
        timestamp: new Date(),
        sender: "ai",
        isNew: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);

      // Show PDF preview after AI generates plan
      setTimeout(() => {
        setShowPdfPreview(true);
      }, 500);
    }, 2000);
  }, []);

  const handleMicrophoneClicked = useCallback(() => {
    console.log("Microphone clicked - voice input not implemented");
  }, []);

  const handleDownloadClick = useCallback(() => {
    setShowDownloadModal(true);
  }, []);

  const handleConfirmClick = useCallback(() => {
    setShowRfpConfirmModal(true);
  }, []);

  const handleSelectVendors = useCallback(() => {
    setShowRfpConfirmModal(false);
    setVendorSearchQuery("");
    setShowVendorSelectionModal(true);
  }, []);

  const handleCloseVendorModal = useCallback(() => {
    setShowVendorSelectionModal(false);
    setVendorSearchQuery("");
  }, []);

  const handleVendorToggle = useCallback((vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, isSelected: !v.isSelected } : v
      )
    );
  }, []);

  const handleSendRfp = useCallback(() => {
    setIsSendingRfp(true);
    // Simulate sending
    setTimeout(() => {
      const selected = vendors.filter((v) => v.isSelected);
      setSentVendors(selected);
      setIsSendingRfp(false);
      setShowVendorSelectionModal(false);
      setVendorSearchQuery("");
      setShowRfpSentModal(true);
    }, 1000);
  }, [vendors]);

  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    console.log("Download format:", selectedFormat);
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      setShowDownloadModal(false);
      alert(`Downloading as ${selectedFormat.toUpperCase()}...`);
    }, 1000);
  }, [selectedFormat]);

  const handleCloseDownloadModal = useCallback(() => {
    setShowDownloadModal(false);
    setSelectedFormat("pdf");
  }, []);

  const handleVendorChat = useCallback(() => {
    setShowRfpSentModal(false);
    router.push("/buyer/carry");
  }, [router]);

  const handleBackToBuyerHome = useCallback(() => {
    router.push("/buyer");
  }, [router]);

  const handleContentChanged = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    <PageTransition>
      <div className={styles.container}>
        <TabNavigation tabs={PROJECT_PLAN_TABS} onTabChange={handleTabChange} />

        <div className={styles.chatContent}>
          {/* Chat Messages Container */}
          <div className={styles.messagesArea}>
            <div ref={scrollContainerRef} className={styles.scrollContainer}>
              <div className={styles.messagesWrapper}>
                <ChatMessageList
                  messages={messages}
                  isLoading={isLoading}
                  messageVariant="minimal"
                  animateMessages
                  charsPerFrame={1}
                  typingSpeed={15}
                  useInternalScroll={false}
                  onContentChanged={handleContentChanged}
                />

                {/* PDF Preview */}
                {showPdfPreview && (
                  <div className={styles.pdfPreviewWrapper}>
                    <PdfPreview
                      pages={MOCK_PDF_PAGES}
                      completedCount={5}
                      totalCount={5}
                      onDownload={handleDownloadClick}
                      onConfirm={handleConfirmClick}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={styles.bottomSection}>
            {/* Mode Indicator */}
            <button
              type="button"
              className={styles.modeIndicator}
              onClick={handleBackToBuyerHome}
            >
              <svg
                width="12"
                height="15"
                viewBox="0 0 12 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 14V1M1 1H9.5L7.5 4.5L9.5 8H1V1Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>プロジェクト計画書作成モード ON</span>
            </button>

            {/* Mode Description */}
            <p className={styles.modeDescription}>{MODE_DESCRIPTION}</p>

            {/* Chat Input */}
            <ChatInputBox
              placeholder={CHAT_INPUT_PLACEHOLDER}
              onMessageSent={handleMessageSent}
              onMicrophoneClicked={handleMicrophoneClicked}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Download Format Modal */}
        <Modal
          isOpen={showDownloadModal}
          onClose={handleCloseDownloadModal}
          title="保存形式を選択してください"
          size="sm"
        >
          {/* Format Options */}
          <div className={styles.formatOptions}>
            {/* PDF Option */}
            <label className={styles.formatOption}>
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={selectedFormat === "pdf"}
                onChange={() => setSelectedFormat("pdf")}
                className={styles.radioInput}
              />
              <span className={styles.formatLabel}>PDF形式</span>
            </label>

            {/* PPT Option */}
            <label className={styles.formatOption}>
              <input
                type="radio"
                name="format"
                value="ppt"
                checked={selectedFormat === "ppt"}
                onChange={() => setSelectedFormat("ppt")}
                className={styles.radioInput}
              />
              <span className={styles.formatLabel}>PPT(β版)形式</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className={styles.downloadModalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCloseDownloadModal}
            >
              キャンセル
            </button>
            <button
              type="button"
              className={styles.downloadButton}
              disabled={isDownloading}
              onClick={handleDownload}
            >
              {isDownloading ? (
                <span className={styles.btnSpinner}></span>
              ) : (
                "ダウンロード"
              )}
            </button>
          </div>
        </Modal>

        {/* RFP Confirm Modal */}
        <Modal
          isOpen={showRfpConfirmModal}
          onClose={() => setShowRfpConfirmModal(false)}
          title="送信するRFPを確認"
          size="lg"
        >
          {/* PDF Preview Section */}
          <div className={styles.rfpPreviewContainer}>
            <div className={styles.rfpPreviewImage}>
              <img src="/pictures/pic1.jpg" alt="PDF Preview" />
            </div>
            <div className={styles.rfpPreviewImage}>
              <img src="/pictures/pic2.jpg" alt="PDF Preview" />
            </div>
          </div>

          {/* Action Button */}
          <div className={styles.rfpConfirmActions}>
            <button
              type="button"
              className={styles.selectVendorButton}
              onClick={handleSelectVendors}
            >
              ベンダーの選択へ
            </button>
          </div>
        </Modal>

        {/* Vendor Selection Modal */}
        <Modal
          isOpen={showVendorSelectionModal}
          onClose={handleCloseVendorModal}
          title="送信先のベンダーを選択"
          size="lg"
        >
          {/* Search Input */}
          <div className={styles.vendorSearchContainer}>
            <div className={styles.vendorSearchIcon}>
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
            </div>
            <input
              type="text"
              value={vendorSearchQuery}
              onChange={(e) => setVendorSearchQuery(e.target.value)}
              placeholder="ベンダーを検索..."
              className={styles.vendorSearchInput}
            />
          </div>

          {/* Vendor List */}
          <div className={styles.vendorList}>
            <div className={styles.vendorGrid}>
              {filteredVendors.map((vendor) => (
                <label
                  key={vendor.id}
                  className={`${styles.vendorItem} ${vendor.isSelected ? styles.selected : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={vendor.isSelected}
                    onChange={() => handleVendorToggle(vendor.id)}
                    className={styles.vendorCheckbox}
                  />
                  <span>{vendor.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className={styles.vendorModalActions}>
            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSendRfp}
              disabled={selectedVendorCount === 0 || isSendingRfp}
            >
              {isSendingRfp ? (
                <span className={styles.btnSpinner}></span>
              ) : (
                "送信"
              )}
            </button>
          </div>
        </Modal>

        {/* RFP Sent Modal */}
        <Modal
          isOpen={showRfpSentModal}
          onClose={() => setShowRfpSentModal(false)}
          title="以下のベンダーへRFPを送信しました"
          size="md"
        >
          {/* Vendor List */}
          <div className={styles.sentVendorContent}>
            {sentVendorRows.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.sentVendorRow}>
                {row.map((vendor) => (
                  <span key={vendor.id} className={styles.sentVendorName}>
                    {vendor.name}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className={styles.rfpSentActions}>
            <button
              type="button"
              className={styles.vendorChatButton}
              onClick={handleVendorChat}
            >
              ベンダチャット
            </button>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setShowRfpSentModal(false)}
            >
              閉じる
            </button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
