"use client";

import { Modal } from "@/shared/components/ui/Modal/Modal";
import { DeleteConfirmModalState } from "@/shared/types";

interface DeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
  memberName: string;
  isDeleting?: boolean;
  modalState?: DeleteConfirmModalState;
}

export function DeleteMemberModal({
  isOpen,
  onClose,
  onDeleteConfirm,
  memberName,
  isDeleting = false,
  modalState = "confirm",
}: DeleteMemberModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      customClass="px-[35px] py-[20px] gap-[25px]"
      isLoading={isDeleting}
      actions={
        modalState === "confirm" ? (
          <div className="flex gap-[10px] items-start">
            <button
              type="button"
              className="bg-[#e1e1e1] px-[15px] py-[10px] rounded-[8px] font-normal text-[14px] text-[#333] border-none cursor-pointer hover:bg-[#d0d0d0] transition-colors"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="bg-[#333] px-[15px] py-[10px] rounded-[8px] font-normal text-[14px] text-white border-none cursor-pointer hover:bg-[#444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
              onClick={onDeleteConfirm}
            >
              削除
            </button>
          </div>
        ) : (
          <div className="flex items-start">
            <button
              type="button"
              className="bg-[#e1e1e1] px-[15px] py-[10px] rounded-[8px] font-normal text-[14px] text-[#333] border-none cursor-pointer hover:bg-[#d0d0d0] transition-colors"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-[25px] items-center px-[35px] w-full">
        <p className="font-normal text-[20px] text-[#066a9e] text-center m-0">
          メンバーを削除
        </p>
        <div className="flex flex-col items-center w-full whitespace-nowrap">
          {modalState === "confirm" ? (
            <p className="font-medium text-[14px] leading-[1.3] text-[#333] text-center m-0">
              {memberName}　をこのグループから削除しますか？
            </p>
          ) : (
            <p className="font-medium text-[14px] leading-[1.3] text-[#333] text-center m-0">
              削除完了しました。
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
