"use client";

import { Modal } from "../Modal";
import { DeleteConfirmModalState } from "@/shared/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConfirmClick: () => void;
  selectedCount?: number;
  message?: string;
  isDeleting?: boolean;
  modalState?: DeleteConfirmModalState;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onDeleteConfirmClick,
  selectedCount: _selectedCount = 0,
  message: _message,
  isDeleting = false,
  modalState = "confirm",
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={modalState === "complete" ? "sm" : "md"}
      customClass={`p-[20px_35px] gap-[25px] ${modalState === "complete" ? "w-[500px] max-w-[500px] h-[174px]" : ""
        }`}
      isLoading={isDeleting}
      actions={
        modalState === "confirm" ? (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] leading-[19px] text-[#333333] cursor-pointer transition-colors duration-200 min-w-[72px] h-[39px] flex items-center justify-center hover:bg-[#d0d0d0]"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="py-[10px] px-[15px] bg-[#333333] border-none rounded-[8px] font-normal text-[14px] leading-[19px] text-white cursor-pointer transition-colors duration-200 min-w-[80px] h-[39px] flex items-center justify-center hover:enabled:bg-[#444444] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
              onClick={onDeleteConfirmClick}
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "削除"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] leading-[19px] text-[#333333] cursor-pointer transition-colors duration-200 min-w-[72px] h-[39px] flex items-center justify-center hover:bg-[#d0d0d0]"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      <div className="font-noto font-[400] text-[20px] leading-[100%] text-[#066A9E] text-center w-full mb-[25px]">
        メンバー削除
      </div>
      {modalState === "confirm" ? (
        <div className="text-center flex flex-col items-center justify-center w-full m-0 p-0">
          <p className="font-medium text-[14px] leading-[1.3] text-[#333333] text-center m-0 w-full p-0">選択したメンバーを削除します。</p>
          <p className="font-medium text-[14px] leading-[1.3] text-[#333333] text-center m-0 w-full p-0">よろしいですか？</p>
        </div>
      ) : (
        <p className="font-medium text-[14px] leading-[1.3] text-[#333333] text-center m-0 w-full p-0">選択したメンバーを削除しました。</p>
      )}
    </Modal>
  );
}
