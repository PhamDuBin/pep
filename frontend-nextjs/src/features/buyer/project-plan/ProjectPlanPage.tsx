"use client";

import { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TabNavigation,
  ChatMessageList,
  ChatInputBox,
  Modal,
  PageTransition,
} from "@/components";
import { PdfPreview } from "./components";
import { useProjectPlan } from "./hooks";
import {
  PROJECT_PLAN_TABS,
  MOCK_PDF_PAGES,
  MODE_DESCRIPTION,
  CHAT_INPUT_PLACEHOLDER,
} from "./mock";
import { Tab } from "./types";
import styles from "./ProjectPlanPage.module.scss";

export function ProjectPlanPage() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    showPdfPreview,
    showDownloadModal,
    selectedFormat,
    setSelectedFormat,
    isDownloading,
    showRfpConfirmModal,
    showVendorSelectionModal,
    showRfpSentModal,
    filteredVendors,
    selectedVendorCount,
    sentVendorRows,
    vendorSearchQuery,
    setVendorSearchQuery,
    isSendingRfp,
    sendMessage,
    openDownloadModal,
    closeDownloadModal,
    handleDownload,
    openRfpConfirmModal,
    closeRfpConfirmModal,
    openVendorSelectionModal,
    closeVendorSelectionModal,
    toggleVendor,
    sendRfp,
    closeRfpSentModal,
  } = useProjectPlan();

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

  const handleMicrophoneClicked = useCallback(() => {
    console.log("Microphone clicked - voice input not implemented");
  }, []);

  const handleVendorChat = useCallback(() => {
    closeRfpSentModal();
    router.push("/buyer/carry");
  }, [router, closeRfpSentModal]);

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

                {showPdfPreview && (
                  <div className={styles.pdfPreviewWrapper}>
                    <PdfPreview
                      pages={MOCK_PDF_PAGES}
                      completedCount={5}
                      totalCount={5}
                      onDownload={openDownloadModal}
                      onConfirm={openRfpConfirmModal}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.bottomSection}>
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

            <p className={styles.modeDescription}>{MODE_DESCRIPTION}</p>

            <ChatInputBox
              placeholder={CHAT_INPUT_PLACEHOLDER}
              onMessageSent={sendMessage}
              onMicrophoneClicked={handleMicrophoneClicked}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Download Format Modal */}
        <Modal
          isOpen={showDownloadModal}
          onClose={closeDownloadModal}
          title="保存形式を選択してください"
          size="sm"
        >
          <div className={styles.formatOptions}>
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

          <div className={styles.downloadModalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={closeDownloadModal}
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
          onClose={closeRfpConfirmModal}
          title="送信するRFPを確認"
          size="lg"
        >
          <div className={styles.rfpPreviewContainer}>
            <div className={styles.rfpPreviewImage}>
              <img src="/pictures/pic1.jpg" alt="PDF Preview" />
            </div>
            <div className={styles.rfpPreviewImage}>
              <img src="/pictures/pic2.jpg" alt="PDF Preview" />
            </div>
          </div>

          <div className={styles.rfpConfirmActions}>
            <button
              type="button"
              className={styles.selectVendorButton}
              onClick={openVendorSelectionModal}
            >
              ベンダーの選択へ
            </button>
          </div>
        </Modal>

        {/* Vendor Selection Modal */}
        <Modal
          isOpen={showVendorSelectionModal}
          onClose={closeVendorSelectionModal}
          title="送信先のベンダーを選択"
          size="lg"
        >
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
                    onChange={() => toggleVendor(vendor.id)}
                    className={styles.vendorCheckbox}
                  />
                  <span>{vendor.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.vendorModalActions}>
            <button
              type="button"
              className={styles.sendButton}
              onClick={sendRfp}
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
          onClose={closeRfpSentModal}
          title="以下のベンダーへRFPを送信しました"
          size="md"
        >
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
              onClick={closeRfpSentModal}
            >
              閉じる
            </button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
