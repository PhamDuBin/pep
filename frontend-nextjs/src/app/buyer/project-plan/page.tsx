"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TabNavigation,
  ChatMessageList,
  ChatInputBox,
  PdfPreview,
  Modal,
} from "@/components";
import { HOME_TABS } from "@/mocks";
import {
  MOCK_PDF_PAGES,
  MOCK_VENDORS,
  PROJECT_PLAN_AI_RESPONSE,
  MODE_DESCRIPTION,
  CHAT_INPUT_PLACEHOLDER,
  INITIAL_AI_MESSAGE,
} from "@/mocks/project-plan";
import { Tab, ChatMessage, Vendor } from "@/types";
import styles from "./page.module.scss";

export default function ProjectPlanPage() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_AI_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showRfpConfirmModal, setShowRfpConfirmModal] = useState(false);
  const [showVendorSelectionModal, setShowVendorSelectionModal] =
    useState(false);
  const [showRfpSentModal, setShowRfpSentModal] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [sentVendors, setSentVendors] = useState<Vendor[]>([]);

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

  const handleMessageSent = useCallback(
    (message: string) => {
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
    },
    []
  );

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
    setShowVendorSelectionModal(true);
  }, []);

  const handleVendorToggle = useCallback((vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, isSelected: !v.isSelected } : v
      )
    );
  }, []);

  const handleSendRfp = useCallback(() => {
    const selected = vendors.filter((v) => v.isSelected);
    setSentVendors(selected);
    setShowVendorSelectionModal(false);
    setShowRfpSentModal(true);
  }, [vendors]);

  const handleDownloadFormat = useCallback((format: "pdf" | "ppt") => {
    console.log("Download format:", format);
    setShowDownloadModal(false);
    // Simulate download
    alert(`Downloading as ${format.toUpperCase()}...`);
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
    <div className={styles.container}>
      <TabNavigation tabs={HOME_TABS} onTabChange={handleTabChange} />

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
        onClose={() => setShowDownloadModal(false)}
        title="ダウンロード形式を選択"
        size="sm"
      >
        <div className={styles.downloadOptions}>
          <button
            type="button"
            className="modal-btn-outline"
            onClick={() => handleDownloadFormat("pdf")}
          >
            PDF形式
          </button>
          <button
            type="button"
            className="modal-btn-outline"
            onClick={() => handleDownloadFormat("ppt")}
          >
            PowerPoint形式
          </button>
        </div>
      </Modal>

      {/* RFP Confirm Modal */}
      <Modal
        isOpen={showRfpConfirmModal}
        onClose={() => setShowRfpConfirmModal(false)}
        title="RFP作成確定"
        size="sm"
      >
        <div className={styles.modalContent}>
          <p>RFP（提案依頼書）を作成してベンダーに送信しますか？</p>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowRfpConfirmModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={handleSelectVendors}
          >
            ベンダーを選択
          </button>
        </div>
      </Modal>

      {/* Vendor Selection Modal */}
      <Modal
        isOpen={showVendorSelectionModal}
        onClose={() => setShowVendorSelectionModal(false)}
        title="送信先ベンダーを選択"
        size="lg"
      >
        <div className={styles.vendorGrid}>
          {vendors.map((vendor) => (
            <label key={vendor.id} className={styles.vendorItem}>
              <input
                type="checkbox"
                checked={vendor.isSelected}
                onChange={() => handleVendorToggle(vendor.id)}
              />
              <span>{vendor.name}</span>
            </label>
          ))}
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowVendorSelectionModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={handleSendRfp}
            disabled={!vendors.some((v) => v.isSelected)}
          >
            RFP送信
          </button>
        </div>
      </Modal>

      {/* RFP Sent Modal */}
      <Modal
        isOpen={showRfpSentModal}
        onClose={() => setShowRfpSentModal(false)}
        title="RFP送信完了"
        size="md"
      >
        <div className={styles.modalContent}>
          <p>以下のベンダーにRFPを送信しました：</p>
          <div className={styles.sentVendorList}>
            {sentVendors.map((vendor) => (
              <span key={vendor.id} className={styles.vendorBadge}>
                {vendor.name}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowRfpSentModal(false)}
          >
            閉じる
          </button>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={handleVendorChat}
          >
            ベンダーチャットへ
          </button>
        </div>
      </Modal>
    </div>
  );
}
