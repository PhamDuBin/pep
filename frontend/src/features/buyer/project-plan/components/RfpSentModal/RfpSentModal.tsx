"use client";

import { Modal } from "@/shared/components";

interface Vendor {
  id: string;
  name: string;
}

interface RfpSentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorRows: Vendor[][];
  onVendorChat: () => void;
}

export function RfpSentModal({
  isOpen,
  onClose,
  vendorRows,
  onVendorChat,
}: RfpSentModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="以下のベンダーへRFPを送信しました"
      size="md"
    >
      <div className="text-center flex flex-col gap-[8px]">
        {vendorRows.map((row, rowIndex) => (
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
          onClick={onVendorChat}
        >
          ベンダチャット
        </button>
        <button
          type="button"
          className="py-[8px] px-[24px] bg-[#e1e1e1] border border-[#e1e1e1] rounded-[4px] text-[14px] text-[#333333] cursor-pointer transition-colors duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#f9fafb]"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </Modal>
  );
}
