"use client";

import { Modal } from "@/shared/components";

interface DownloadFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFormat: "pdf" | "ppt";
  onFormatChange: (format: "pdf" | "ppt") => void;
  isDownloading: boolean;
  onDownload: () => void;
}

export function DownloadFormatModal({
  isOpen,
  onClose,
  selectedFormat,
  onFormatChange,
  isDownloading,
  onDownload,
}: DownloadFormatModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
            onChange={() => onFormatChange("pdf")}
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
            onChange={() => onFormatChange("ppt")}
            className="w-[16px] h-[16px] accent-[#066a9e] cursor-pointer"
          />
          <span className="text-[14px] text-[#333333]">PPT(β版)形式</span>
        </label>
      </div>

      <div className="flex flex-row gap-[10px] justify-center items-center pt-[20px]">
        <button
          type="button"
          className="py-[8px] px-[24px] border border-[#e1e1e1] rounded-[4px] text-[14px] text-[#333333] bg-transparent cursor-pointer transition-colors duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#f9fafb]"
          onClick={onClose}
        >
          キャンセル
        </button>
        <button
          type="button"
          className="py-[8px] px-[24px] bg-[#333333] text-[#ffffff] border-none rounded-[4px] text-[14px] cursor-pointer transition-opacity duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] min-w-[120px] flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isDownloading}
          onClick={onDownload}
        >
          {isDownloading ? (
            <span className="inline-block w-[16px] h-[16px] border-2 border-[rgba(255,255,255,0.3)] border-t-[#ffffff] rounded-full animate-spin"></span>
          ) : (
            "ダウンロード"
          )}
        </button>
      </div>
    </Modal>
  );
}
