"use client";

import { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TabNavigation,
  ChatMessageList,
  ChatInputBox,
  Modal,
  PageTransition,
} from "@/shared/components";
import { PdfPreview } from "./components";
import { useProjectPlan } from "./hooks";
import {
  PROJECT_PLAN_TABS,
  MOCK_PDF_PAGES,
  MODE_DESCRIPTION,
  CHAT_INPUT_PLACEHOLDER,
} from "./mock";
import { Tab } from "./types";

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
      <div className="flex flex-col h-full bg-[#ffffff]">
        <TabNavigation tabs={PROJECT_PLAN_TABS} onTabChange={handleTabChange} />

        <div className="flex flex-col h-[calc(100vh-89px-94px)] bg-[#ffffff] py-[50px] px-[75px]">
          <div className="flex-1 flex flex-col gap-[25px] items-center overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="w-full max-w-[800px] flex-1 overflow-y-auto pr-[8px] overscroll-contain scroll-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#d1d5db] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[#9ca3af]"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="block w-full">
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
                  <div className="block relative z-[1] mt-[24px]">
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

          <div className="flex flex-col gap-[20px] items-center justify-center w-full max-w-[800px] mx-auto pt-[20px]">
            <button
              type="button"
              className="flex items-center gap-[5px] py-[7px] px-[15px] bg-gradient-to-r from-[#8ec5d0] to-[#066a9e] border-none rounded-[8px] cursor-pointer transition-opacity duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:opacity-90 [&>span]:text-[14px] [&>span]:text-[#ffffff] [&>span]:font-normal"
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

            <p className="text-[13px] text-[#066a9e] text-center p-[8px] bg-[#f5f5f5] rounded-[2px] w-full">
              {MODE_DESCRIPTION}
            </p>

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
          <div className="flex justify-center gap-[32px]">
            <label className="flex items-center gap-[8px] cursor-pointer">
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={selectedFormat === "pdf"}
                onChange={() => setSelectedFormat("pdf")}
                className="w-[16px] h-[16px] accent-[#066a9e] cursor-pointer"
              />
              <span className="text-[14px] text-[#333333]">PDF形式</span>
            </label>

            <label className="flex items-center gap-[8px] cursor-pointer">
              <input
                type="radio"
                name="format"
                value="ppt"
                checked={selectedFormat === "ppt"}
                onChange={() => setSelectedFormat("ppt")}
                className="w-[16px] h-[16px] accent-[#066a9e] cursor-pointer"
              />
              <span className="text-[14px] text-[#333333]">PPT(β版)形式</span>
            </label>
          </div>

          <div className="flex flex-row gap-[10px] justify-center items-center pt-[20px]">
            <button
              type="button"
              className="py-[8px] px-[24px] border border-[#e1e1e1] rounded-[4px] text-[14px] text-[#333333] bg-transparent cursor-pointer transition-colors duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#f9fafb]"
              onClick={closeDownloadModal}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="py-[8px] px-[24px] bg-[#333333] text-[#ffffff] border-none rounded-[4px] text-[14px] cursor-pointer transition-opacity duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] min-w-[120px] flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDownloading}
              onClick={handleDownload}
            >
              {isDownloading ? (
                <span className="inline-block w-[16px] h-[16px] border-2 border-[rgba(255,255,255,0.3)] border-t-[#ffffff] rounded-full animate-spin"></span>
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
          <div className="flex flex-col h-[384px] gap-[16px] border border-[#e1e1e1] rounded-[4px] overflow-auto">
            <div className="w-full min-h-[300px] bg-[#f3f4f6] flex-shrink-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover">
              <img src="/assets/pictures/pic1.jpg" alt="PDF Preview" />
            </div>
            <div className="w-full min-h-[300px] bg-[#f3f4f6] flex-shrink-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover">
              <img src="/assets/pictures/pic2.jpg" alt="PDF Preview" />
            </div>
          </div>

          <div className="flex justify-center pt-[24px]">
            <button
              type="button"
              className="py-[10px] px-[32px] bg-[#066a9e] text-[#ffffff] border-none rounded-[4px] text-[14px] cursor-pointer transition-opacity duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:opacity-90"
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
          <div className="relative w-full mb-[8px]">
            <div className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#808080] flex items-center justify-center">
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
              className="w-full h-[45px] pl-[48px] pr-[16px] border border-[#066a9e] rounded-full text-[14px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(6,106,158,0.3)] placeholder:text-[#808080]"
            />
          </div>

          <div className="max-h-[350px] overflow-y-auto p-[8px] w-full bg-[#f5f5f4] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-[#f1f1f1] [&::-webkit-scrollbar-track]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[#a1a1a1]">
            <div className="grid grid-cols-3 gap-y-[12px] gap-x-[16px] w-full">
              {filteredVendors.map((vendor) => (
                <label
                  key={vendor.id}
                  className={`flex items-center gap-[8px] py-[8px] cursor-pointer transition-colors duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] rounded-[4px] hover:bg-[#f9fafb] [&>span]:text-[14px] [&>span]:text-[#333333] ${
                    vendor.isSelected ? "bg-[rgba(51,51,51,0.05)]" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={vendor.isSelected}
                    onChange={() => toggleVendor(vendor.id)}
                    className="appearance-none w-[20px] h-[20px] border-2 border-[#b9b9b9] rounded-[4px] bg-[#ffffff] cursor-pointer transition-all duration-200 checked:bg-[#333333] checked:border-[#333333] checked:bg-[url('data:image/svg+xml,%3csvg%20viewBox=%270%200%2016%2016%27%20fill=%27white%27%20xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath%20d=%27M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%27/%3e%3c/svg%3e')] checked:bg-[length:100%_100%] checked:bg-center checked:bg-no-repeat hover:border-[#333333] focus:outline-none focus:shadow-[0_0_0_2px_rgba(51,51,51,0.3)]"
                  />
                  <span>{vendor.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-[24px]">
            <button
              type="button"
              className="py-[10px] px-[20px] bg-[#066a9e] text-[#ffffff] border-none rounded-[4px] text-[14px] cursor-pointer transition-opacity duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] min-w-[80px] flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={sendRfp}
              disabled={selectedVendorCount === 0 || isSendingRfp}
            >
              {isSendingRfp ? (
                <span className="inline-block w-[16px] h-[16px] border-2 border-[rgba(255,255,255,0.3)] border-t-[#ffffff] rounded-full animate-spin"></span>
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
          <div className="text-center flex flex-col gap-[8px]">
            {sentVendorRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-[16px]">
                {row.map((vendor) => (
                  <span key={vendor.id} className="text-[14px] text-[#333333]">
                    {vendor.name}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-row gap-[10px] justify-center items-center pt-[24px]">
            <button
              type="button"
              className="py-[8px] px-[24px] bg-[#066a9e] text-[#ffffff] border-none rounded-[4px] text-[14px] cursor-pointer transition-opacity duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:opacity-90"
              onClick={handleVendorChat}
            >
              ベンダチャット
            </button>
            <button
              type="button"
              className="py-[8px] px-[24px] bg-[#e1e1e1] border border-[#e1e1e1] rounded-[4px] text-[14px] text-[#333333] cursor-pointer transition-colors duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#f9fafb]"
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
