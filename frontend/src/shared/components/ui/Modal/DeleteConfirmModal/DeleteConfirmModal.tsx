"use client";

import { Modal } from "../Modal";
import { DeleteConfirmModalState } from "@/shared/types";


interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount?: number;
  message?: string;
  isDeleting?: boolean;
  modalState?: DeleteConfirmModalState;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount = 0,
  message,
  isDeleting = false,
  modalState = "confirm",
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={modalState === "complete" ? "sm" : "md"}
      customClass={
        modalState === "complete"
          ? "!w-[500px] !max-w-[500px] !h-[174px] !py-[20px] !px-[35px] !gap-[25px] !rounded-xl !overflow-hidden"
          : "!py-[20px] !px-[35px] !gap-[25px]"
      }
      isLoading={isDeleting}
      actions={
        modalState === "confirm" ? (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="flex justify-center items-center py-[10px] px-[15px] gap-[10px] min-w-[72px] h-[39px] bg-[#e1e1e1] rounded-[8px] border-none cursor-pointer transition-colors duration-200 font-noto font-[400] text-[14px] leading-[19px] text-[#333333] hover:bg-[#d0d0d0]"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="flex justify-center items-center py-[10px] px-[15px] gap-[10px] min-w-[80px] h-[39px] bg-[#333333] rounded-[8px] border-none cursor-pointer transition-colors duration-200 font-noto font-[400] text-[14px] leading-[19px] text-[#FFFFFF] hover:bg-[#444444] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
              onClick={onConfirm}
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
              className="flex justify-center items-center py-[10px] px-[15px] gap-[10px] min-w-[72px] h-[39px] bg-[#e1e1e1] rounded-[8px] border-none cursor-pointer transition-colors duration-200 font-noto font-[400] text-[14px] leading-[19px] text-[#333333] hover:bg-[#d0d0d0]"
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
        <div className="flex flex-col items-center justify-center w-full m-0 p-0 text-center">
          <p className="font-noto-jp font-[500] text-[14px] leading-[130%] text-[#333333] text-center m-0 w-full p-0">
            選択したメンバーを削除します。
          </p>
          <p className="font-noto-jp font-[500] text-[14px] leading-[130%] text-[#333333] text-center m-0 w-full p-0">
            よろしいですか？
          </p>
        </div>
      ) : (
        <p className="font-noto-jp font-[500] text-[14px] leading-[130%] text-[#333333] text-center m-0 w-full p-0">
          削除完了しました。
        </p>
      )}
    </Modal>
  );
}
