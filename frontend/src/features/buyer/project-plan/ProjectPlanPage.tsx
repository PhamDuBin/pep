"use client";

import { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TabNavigation,
  ChatMessageList,
  ChatInputBox,
  PageTransition,
} from "@/shared/components";
import {
  PdfPreview,
  DownloadFormatModal,
  RfpConfirmModal,
  VendorSelectionModal,
  RfpSentModal,
} from "./components";
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

        <DownloadFormatModal
          isOpen={showDownloadModal}
          onClose={closeDownloadModal}
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
          isDownloading={isDownloading}
          onDownload={handleDownload}
        />

        <RfpConfirmModal
          isOpen={showRfpConfirmModal}
          onClose={closeRfpConfirmModal}
          onConfirm={openVendorSelectionModal}
        />

        <VendorSelectionModal
          isOpen={showVendorSelectionModal}
          onClose={closeVendorSelectionModal}
          vendors={filteredVendors}
          searchQuery={vendorSearchQuery}
          onSearchChange={setVendorSearchQuery}
          onToggleVendor={toggleVendor}
          selectedCount={selectedVendorCount}
          isSending={isSendingRfp}
          onSend={sendRfp}
        />

        <RfpSentModal
          isOpen={showRfpSentModal}
          onClose={closeRfpSentModal}
          vendorRows={sentVendorRows}
          onVendorChat={handleVendorChat}
        />
      </div>
    </PageTransition>
  );
}
