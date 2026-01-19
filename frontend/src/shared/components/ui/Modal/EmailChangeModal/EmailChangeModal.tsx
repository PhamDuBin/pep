"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "../Modal";
import { EmailChangeModalState } from "@/shared/types";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSendClick: (newEmail: string, confirmEmail: string) => void;
  isSaving?: boolean;
  modalState?: EmailChangeModalState;
}

export function EmailChangeModal({
  isOpen,
  onClose,
  onEmailSendClick,
  isSaving = false,
  modalState = "email-change",
}: EmailChangeModalProps) {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  // Reset form when modal opens in email-change state
  useEffect(() => {
    if (isOpen && modalState === "email-change") {
      setNewEmail("");
      setConfirmEmail("");
    }
  }, [isOpen, modalState]);

  const handleClose = useCallback(() => {
    setNewEmail("");
    setConfirmEmail("");
    onClose();
  }, [onClose]);

  const handleSend = useCallback(() => {
    if (newEmail.trim() && confirmEmail.trim() && newEmail === confirmEmail) {
      onEmailSendClick(newEmail.trim(), confirmEmail.trim());
    }
  }, [newEmail, confirmEmail, onEmailSendClick]);

  const isValid =
    newEmail.trim() !== "" &&
    confirmEmail.trim() !== "" &&
    newEmail === confirmEmail;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="メールアドレスを変更"
      size="lg"
      customClass="p-[20px_35px] gap-[25px] [&_.modal-title]:text-[20px] [&_.modal-body]:px-[35px] [&_.modal-body]:gap-[25px] [&_.modal-actions]:flex [&_.modal-actions]:flex-row [&_.modal-actions]:gap-[10px] [&_.modal-actions]:justify-center [&_.modal-actions]:items-center"
      isLoading={isSaving}
      actions={
        modalState === "email-change" ? (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="flex items-center justify-center py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333333] cursor-pointer transition-colors duration-200 hover:bg-[#d1d1d1]"
              onClick={handleClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-[10px] px-[15px] bg-[#333333] border-none rounded-[8px] font-normal text-[14px] text-white cursor-pointer transition-colors duration-200 min-w-[100px] hover:enabled:bg-[#222222] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isValid || isSaving}
              onClick={handleSend}
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "メールを送信"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="flex items-center justify-center py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333333] cursor-pointer transition-colors duration-200 hover:bg-[#d1d1d1]"
              onClick={handleClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "email-change" ? (
        <>
          {/* Email Change Form */}
          <div className="font-medium text-[14px] leading-[1.3] text-black text-center [&_p]:m-0">
            <p>新しいメールアドレス入力してください。</p>
            <p>メールアドレス再設定用URLを送信します。</p>
          </div>

          <div className="flex flex-col gap-[10px] items-start">
            {/* New Email */}
            <div className="flex items-center gap-[10px]">
              <label className="w-[224px] font-normal text-[16px] text-black">新しいメールアドレス</label>
              <input
                type="email"
                className="w-[300px] h-[35px] py-[3px] px-[10px] bg-white border border-[#b9b9b9] rounded-[4px] font-normal text-[16px] text-black box-border placeholder:text-[#808080] focus:outline-none focus:border-[#066a9e]"
                placeholder="メールアドレス"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            {/* Confirm Email */}
            <div className="flex items-center gap-[10px]">
              <label className="w-[224px] font-normal text-[16px] text-black">
                新しいメールアドレス（確認）
              </label>
              <input
                type="email"
                className="w-[300px] h-[35px] py-[3px] px-[10px] bg-white border border-[#b9b9b9] rounded-[4px] font-normal text-[16px] text-black box-border placeholder:text-[#808080] focus:outline-none focus:border-[#066a9e]"
                placeholder="メールアドレス"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Email Sent Confirmation */}
          <div className="font-medium text-[14px] leading-[1.3] text-black text-center [&_p]:m-0">
            <p>ご入力いただいたメールアドレスへ再設定用URLを送信しました。</p>
            <p>メール内のURLをクリックすると、</p>
            <p>メールアドレス変更が完了いたします。</p>
          </div>
        </>
      )}
    </Modal>
  );
}
