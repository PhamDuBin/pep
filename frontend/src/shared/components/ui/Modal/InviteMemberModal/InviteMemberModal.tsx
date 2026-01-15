"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "../Modal";
import { InviteMemberModalState } from "@/shared/types";

interface EmailEntry {
  value: string;
  error: string | null;
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[]) => void;
  existingEmails?: string[];
  isSaving?: boolean;
  modalState?: InviteMemberModalState;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteMemberModal({
  isOpen,
  onClose,
  onInvite,
  existingEmails = [],
  isSaving = false,
  modalState = "form",
}: InviteMemberModalProps) {
  const [emails, setEmails] = useState<EmailEntry[]>([
    { value: "", error: null },
  ]);

  // Reset form when modal opens in form state
  useEffect(() => {
    if (isOpen && modalState === "form") {
      setEmails([{ value: "", error: null }]);
    }
  }, [isOpen, modalState]);

  const validateEmail = useCallback(
    (email: string, allEmails: EmailEntry[]): string | null => {
      if (!email.trim()) {
        return null; // Empty is ok, will be filtered out
      }

      if (!EMAIL_REGEX.test(email.trim())) {
        return "正しいメールアドレス形式で入力してください";
      }

      if (existingEmails.includes(email.trim().toLowerCase())) {
        return "このメールアドレスは既に招待されています";
      }

      // Check for duplicates within the form
      const duplicateCount = allEmails.filter(
        (e) => e.value.trim().toLowerCase() === email.trim().toLowerCase()
      ).length;
      if (duplicateCount > 1) {
        return "このメールアドレスは既に入力されています";
      }

      return null;
    },
    [existingEmails]
  );

  const handleEmailChange = useCallback((index: number, value: string) => {
    setEmails((prev) => {
      const newEmails = [...prev];
      newEmails[index] = { value, error: null };
      return newEmails;
    });
  }, []);

  const addEmailField = useCallback(() => {
    setEmails((prev) => [...prev, { value: "", error: null }]);
  }, []);

  const canAddMore = useCallback((): boolean => {
    const lastEmail = emails[emails.length - 1];
    return lastEmail && lastEmail.value.trim().length > 0;
  }, [emails]);

  const hasValidEmails = useCallback((): boolean => {
    return emails.some(
      (e) => e.value.trim() && !validateEmail(e.value, emails)
    );
  }, [emails, validateEmail]);

  const validateAllEmails = useCallback((): boolean => {
    let isValid = true;
    const newEmails = emails.map((entry) => {
      if (entry.value.trim()) {
        const error = validateEmail(entry.value, emails);
        if (error) {
          isValid = false;
        }
        return { ...entry, error };
      }
      return entry;
    });
    setEmails(newEmails);
    return isValid;
  }, [emails, validateEmail]);

  const handleSendInvitation = useCallback(() => {
    if (!validateAllEmails()) {
      return;
    }

    const validEmails = emails
      .filter((e) => e.value.trim() && !e.error)
      .map((e) => e.value.trim());

    if (validEmails.length > 0) {
      onInvite(validEmails);
    }
  }, [emails, validateAllEmails, onInvite]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="新しいメンバーを招待"
      size="md"
      customClass={`min-w-[520px] max-w-[520px] [&_.modal-title]:text-[20px] [&_.modal-title]:font-normal [&_.modal-title]:text-[#066a9e] ${
        modalState === "complete" ? "w-[340px] min-w-[340px] max-w-[340px] h-[174px]" : ""
      }`}
      isLoading={isSaving}
      actions={
        modalState === "form" ? (
          <div className="flex gap-[10px] justify-center items-center">
            <button
              type="button"
              className="py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] text-[14px] font-normal text-[#333333] cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0]"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="py-[10px] px-[15px] bg-[#333333] border-none rounded-[8px] text-[14px] font-normal text-white cursor-pointer transition-colors duration-200 flex items-center justify-center gap-[8px] min-w-[130px] hover:enabled:bg-[#444444] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || !hasValidEmails()}
              onClick={handleSendInvitation}
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "招待メールを送信"
              )}
            </button>
          </div>
        ) : (
          <div className="flex gap-[10px] justify-center items-center">
            <button
              type="button"
              className="py-[10px] px-[15px] bg-[#e1e1e1] border-none rounded-[8px] text-[14px] font-normal text-[#333333] cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0]"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "form" ? (
        <div className="flex flex-col items-center gap-[25px] w-full px-[35px]">
          {/* Description text */}
          <div className="text-center text-[14px] font-medium leading-[24px] text-[#333333] [&_p]:m-0">
            <p>追加したいメンバーのメールアドレスを入力してください。</p>
            <p>入力したメールアドレス宛に招待メールを送信します。</p>
            <p className="text-[#333333]">※ 招待メールの有効期限は10日間です。</p>
          </div>

          {/* Email inputs */}
          <div className="flex flex-col gap-[10px] w-full">
            {emails.map((email, index) => {
              const isLast = index === emails.length - 1;
              return (
                <div key={index} className="flex flex-col gap-[3px] w-full">
                  <div className="flex items-center gap-[10px] w-full">
                    <input
                      type="email"
                      className="flex-1 h-[35px] py-[3px] px-[10px] border border-[#b9b9b9] rounded-[4px] text-[16px] font-normal text-[#333333] bg-white outline-none transition-colors duration-200 placeholder:text-[#b9b9b9] focus:border-[#066a9e]"
                      placeholder="email@address.com"
                      value={email.value}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    {isLast ? (
                      <button
                        type="button"
                        className={`w-[35px] h-[35px] flex-shrink-0 flex items-center justify-center bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:text-[#066a9e] ${
                          canAddMore() ? "text-[#066a9e]" : "text-[#b9b9b9]"
                        }`}
                        disabled={!canAddMore()}
                        onClick={addEmailField}
                        aria-label="Add email field"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="35"
                          height="35"
                          viewBox="0 0 35 35"
                          fill="none"
                        >
                          <path
                            d="M17.4996 29.4001C10.9196 29.4001 5.59961 24.0801 5.59961 17.5001C5.59961 10.9201 10.9196 5.6001 17.4996 5.6001C24.0796 5.6001 29.3996 10.9201 29.3996 17.5001C29.3996 24.0801 24.0796 29.4001 17.4996 29.4001ZM17.4996 7.0001C11.6896 7.0001 6.99961 11.6901 6.99961 17.5001C6.99961 23.3101 11.6896 28.0001 17.4996 28.0001C23.3096 28.0001 27.9996 23.3101 27.9996 17.5001C27.9996 11.6901 23.3096 7.0001 17.4996 7.0001Z"
                            fill="currentColor"
                          />
                          <path
                            d="M11.2002 16.7998H23.8002V18.1998H11.2002V16.7998Z"
                            fill="currentColor"
                          />
                          <path
                            d="M16.7998 11.2002H18.1998V23.8002H16.7998V11.2002Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    ) : (
                      <div className="w-[35px] h-[35px] flex-shrink-0"></div>
                    )}
                  </div>
                  {email.error && (
                    <span className="text-[12px] font-normal text-[#c10000] leading-normal">{email.error}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center px-[35px]">
          <p className="text-[14px] font-medium text-[#333333] text-center leading-[1.3] m-0">招待メールを送信しました。</p>
        </div>
      )}
    </Modal>
  );
}
