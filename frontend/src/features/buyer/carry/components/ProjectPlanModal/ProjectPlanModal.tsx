"use client";

import { Modal } from "@/shared/components";

interface ProjectPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectPlanModal({ isOpen, onClose }: ProjectPlanModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="プロジェクト計画書"
      size="lg"
      customClass="p-[32px] max-h-[80vh] overflow-y-auto"
      actions={
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="p-[10px_30px] bg-[#e1e1e1] border-none rounded-[8px] text-[14px] font-normal text-[#333333] cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0]"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-[16px]">
        {/* PDF Preview Section */}
        <div className="flex flex-col gap-[16px] h-[384px] border border-[#e1e1e1] rounded-[8px] overflow-y-auto p-[16px] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#d1d5db] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[#9ca3af]">
          <div className="w-full min-h-[300px] bg-[#f3f4f6] flex-shrink-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
            <img src="/assets/pictures/pic1.jpg" alt="PDF Preview" />
          </div>
          <div className="w-full min-h-[300px] bg-[#f3f4f6] flex-shrink-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
            <img src="/assets/pictures/pic2.jpg" alt="PDF Preview" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
