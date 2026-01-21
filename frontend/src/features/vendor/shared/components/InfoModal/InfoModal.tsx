"use client";

import { Modal } from "@/shared/components";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  buttonText?: string;
}

export function InfoModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "閉じる",
}: InfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-[12px] py-[10px] w-full">
        {typeof message === "string" ? (
          <p className="font-noto-jp text-[14px] text-[#333333] m-0 leading-[1.6] whitespace-pre-line text-center">
            {message}
          </p>
        ) : (
          message
        )}
      </div>
      <div className="flex justify-center gap-[10px] pt-[20px] w-full">
        <button
          type="button"
          className="modal-btn-secondary"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
}
