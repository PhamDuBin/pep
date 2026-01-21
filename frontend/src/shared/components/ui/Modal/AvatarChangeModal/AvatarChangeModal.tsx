"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "../Modal";
import { AVATAR_COLOR_OPTIONS } from "@/shared/mocks";

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarSaveClick: (color: string) => void;
  currentColor?: string;
  isSaving?: boolean;
}

export function AvatarChangeModal({
  isOpen,
  onClose,
  onAvatarSaveClick,
  currentColor = "#8ec5d0",
  isSaving = false,
}: AvatarChangeModalProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  useEffect(() => {
    if (isOpen) {
      setSelectedColor(currentColor);
    }
  }, [isOpen, currentColor]);

  const handleSave = useCallback(() => {
    onAvatarSaveClick(selectedColor);
  }, [selectedColor, onAvatarSaveClick]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="アイコンの変更"
      size="md"
      customClass="p-[20px_35px] gap-[25px] w-[500px] max-w-[500px] [&_.modal-title]:text-[20px] [&_.modal-body]:px-[35px] [&_.modal-body]:gap-[25px] [&_.modal-actions]:flex [&_.modal-actions]:flex-row [&_.modal-actions]:gap-[10px] [&_.modal-actions]:justify-center [&_.modal-actions]:items-center"
      isLoading={isSaving}
      actions={
        <div className="flex flex-row gap-[10px] justify-center items-center">
          <button
            type="button"
            className="flex items-center justify-center py-[10px] px-[15px] bg-[#333333] border-none rounded-[8px] font-normal text-[14px] text-white cursor-pointer transition-colors duration-200 min-w-[80px] hover:enabled:bg-[#222222] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "保存"
            )}
          </button>
          <button
            type="button"
            className="flex items-center justify-center py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333333] cursor-pointer transition-colors duration-200 hover:bg-[#d1d1d1]"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      }
    >
      {/* Color Options */}
      <div className="flex gap-[15px] items-center justify-center">
        {AVATAR_COLOR_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`w-[70px] h-[70px] rounded-full border-[3px] cursor-pointer transition-all duration-200 p-0 hover:scale-105 ${selectedColor === option.color
              ? "border-[#066a9e]"
              : "border-transparent"
              }`}
            style={{
              backgroundColor: option.color,
            }}
            onClick={() => setSelectedColor(option.color)}
          />
        ))}
      </div>
    </Modal>
  );
}
