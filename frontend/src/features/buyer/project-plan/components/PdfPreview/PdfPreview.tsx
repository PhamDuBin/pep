"use client";

import { PdfPage } from "../../types";

interface PdfPreviewProps {
  pages: PdfPage[];
  completedCount?: number;
  totalCount?: number;
  onDownload?: () => void;
  onConfirm?: () => void;
}

export function PdfPreview({
  pages,
  completedCount = 5,
  totalCount = 5,
  onDownload,
  onConfirm,
}: PdfPreviewProps) {
  return (
    <div className="block w-full max-w-[500px] p-[16px] bg-white border border-[#b9b9b9] rounded-[8px] animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-[16px]">
        <h3 className="font-noto-jp text-[14px] font-normal text-[#333] m-0">
          PDFページプレビュー
        </h3>
        <span className="font-noto-jp text-[14px] text-[#066a9e]">
          完了({completedCount}/{totalCount})
        </span>
      </div>

      {/* Page Thumbnails */}
      <div className="flex gap-[12px] mb-[16px] overflow-x-auto pb-[8px] [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-track]:bg-[#f1f1f1] [&::-webkit-scrollbar-track]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-thumb]:rounded-[2px]">
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex flex-col items-center min-w-[80px] shrink-0"
          >
            {/* Thumbnail */}
            <div className="w-[80px] h-[100px] border border-[#b9b9b9] rounded-[4px] bg-[#f9fafb] flex items-center justify-center mb-[8px]">
              <div className="w-[60px] h-[80px] bg-white border border-[#e5e7eb] rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center">
                <span className="font-noto-jp text-[10px] text-[#808080]">
                  PDF
                </span>
              </div>
            </div>
            {/* Page Title */}
            <span className="font-noto-jp text-[12px] text-[#333] text-center whitespace-nowrap">
              {page.title}
            </span>
            <span className="font-noto-jp text-[11px] text-[#808080]">
              Page{page.pageNumber}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[12px]">
        <button
          type="button"
          className="flex items-center gap-[8px] py-[8px] px-[16px] bg-white border border-[#b9b9b9] rounded-[8px] font-noto-jp text-[14px] text-[#333] cursor-pointer transition-colors duration-200 hover:bg-[#f9fafb]"
          onClick={onDownload}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 12L3 7H6V2H10V7H13L8 12Z"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 14H14"
              stroke="#333"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>プロジェクト計画書をダウンロード</span>
        </button>

        <button
          type="button"
          className="py-[8px] px-[24px] bg-[#808080] border-none rounded-[8px] font-noto-jp text-[14px] text-white cursor-pointer transition-opacity duration-200 hover:opacity-90"
          onClick={onConfirm}
        >
          確認
        </button>
      </div>
    </div>
  );
}
