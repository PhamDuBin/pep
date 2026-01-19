"use client";

import { Modal } from "@/shared/components";

interface RfpConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RfpConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: RfpConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          onClick={onConfirm}
        >
          ベンダーの選択へ
        </button>
      </div>
    </Modal>
  );
}
