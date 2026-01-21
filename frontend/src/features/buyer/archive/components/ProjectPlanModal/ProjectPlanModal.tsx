"use client";

import { Modal } from "@/shared/components";
import { ArchiveProject } from "../../models";

interface ProjectPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ArchiveProject | null;
}

// Mock plan images for demo
const MOCK_PLAN_IMAGES = [
  "/assets/pictures/pic1.jpg",
  "/assets/pictures/pic2.jpg",
];

export function ProjectPlanModal({
  isOpen,
  onClose,
  project,
}: ProjectPlanModalProps) {
  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="プロジェクト計画書"
      size="xl"
      customClass="min-w-[800px] max-w-[800px] [&_.modal-title]:text-[20px] [&_.modal-title]:font-normal [&_.modal-title]:text-[#066a9e]"
      showCloseButton={true}
      actions={
        <div className="flex justify-center">
          <button
            type="button"
            className="py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] text-[14px] font-normal text-[#333] cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0]"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center w-full">
        {/* Scrollable content area */}
        <div className="flex flex-col gap-[10px] w-full max-h-[474px] overflow-y-auto">
          {/* Plan images - in real implementation, these would come from API */}
          {MOCK_PLAN_IMAGES.map((image, index) => (
            <div
              key={index}
              className="w-full aspect-[1024/576] border border-[#e1e1e1] rounded-[8px] overflow-hidden bg-[#f5f5f5] flex items-center justify-center"
            >
              <img
                src={image}
                alt={`計画書ページ ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback for missing images - show placeholder
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-[#808080]">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <p class="mt-2 text-[14px]">計画書ページ ${index + 1}</p>
                    </div>
                  `;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
