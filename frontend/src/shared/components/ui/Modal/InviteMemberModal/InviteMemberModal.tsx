"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Modal } from "../Modal";
import { InviteMemberModalState } from "@/shared/types";

interface EmailEntry {
  value: string;
  error: string | null;
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteMemberClick: (emails: string[]) => void;
  existingEmails?: string[];
  isSaving?: boolean;
  modalState?: InviteMemberModalState;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteMemberModal({
  isOpen,
  onClose,
  onInviteMemberClick,
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
      const trimmedEmail = email.trim();

      // Empty is ok - will be filtered out when sending
      if (!trimmedEmail) {
        return null;
      }

      // Check email format
      if (!EMAIL_REGEX.test(trimmedEmail)) {
        return "正しいメールアドレス形式で入力してください";
      }

      // Check if already invited
      if (existingEmails.includes(trimmedEmail.toLowerCase())) {
        return "このメールアドレスは既に招待されています";
      }

      // Check for duplicates within non-empty emails only
      const nonEmptyEmails = allEmails.filter((e) => e.value.trim());
      const duplicateCount = nonEmptyEmails.filter(
        (e) => e.value.trim().toLowerCase() === trimmedEmail.toLowerCase()
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
    // Check if there's at least one non-empty email with valid format
    const nonEmptyEmails = emails.filter((e) => e.value.trim());
    if (nonEmptyEmails.length === 0) return false;

    // Check if at least one email is valid (ignore empty fields)
    return nonEmptyEmails.some((entry) => {
      const email = entry.value.trim();
      // Check format
      if (!EMAIL_REGEX.test(email)) return false;
      // Check if already exists
      if (existingEmails.includes(email.toLowerCase())) return false;
      // Check duplicates within non-empty emails only
      const duplicateCount = nonEmptyEmails.filter(
        (e) => e.value.trim().toLowerCase() === email.toLowerCase()
      ).length;
      if (duplicateCount > 1) return false;
      return true;
    });
  }, [emails, existingEmails]);

  const validateAllEmails = useCallback((): boolean => {
    let isValid = true;
    // Only validate non-empty emails
    const nonEmptyEmails = emails.filter((e) => e.value.trim());

    const newEmails = emails.map((entry) => {
      const email = entry.value.trim();
      // Skip empty fields - they are valid (will be filtered out when sending)
      if (!email) {
        return { ...entry, error: null };
      }

      // Validate non-empty email
      const error = validateEmail(entry.value, emails);
      if (error) {
        isValid = false;
      }
      return { ...entry, error };
    });

    setEmails(newEmails);
    // Return true if we have at least one valid non-empty email
    return isValid && nonEmptyEmails.length > 0;
  }, [emails, validateEmail]);

  const handleSendInvitation = useCallback(() => {
    if (!validateAllEmails()) {
      return;
    }

    const validEmails = emails
      .filter((e) => e.value.trim() && !e.error)
      .map((e) => e.value.trim());

    if (validEmails.length > 0) {
      onInviteMemberClick(validEmails);
    }
  }, [emails, validateAllEmails, onInviteMemberClick]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      customClass={`min-w-[520px] max-w-[520px] [&_.modal-title]:text-[20px] [&_.modal-title]:font-normal [&_.modal-title]:text-[#066a9e] ${modalState === "complete"
        ? "w-[340px] min-w-[340px] max-w-[340px] h-[174px]"
        : ""
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
              // disabled={isSaving || !hasValidEmails()}
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
      <div className="font-noto font-[400] text-[20px] leading-[27px] text-[#066A9E] text-center w-full mb-[25px]">
        新しいメンバーを招待
      </div>

      {modalState === "form" ? (
        <div className="flex flex-col items-center gap-[25px] w-full px-[35px]">
          {/* Description text */}
          <div className="text-center text-[14px] font-medium leading-[24px] text-[#333333] [&_p]:m-0">
            <p>追加したいメンバーのメールアドレスを入力してください。</p>
            <p>入力したメールアドレス宛に招待メールを送信します。</p>
            <p className="text-[#333333]">
              ※ 招待メールの有効期限は10日間です。
            </p>
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
                      spellCheck={false}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    {isLast ? (
                      <button
                        type="button"
                        className={`w-[35px] h-[35px] flex-shrink-0 flex items-center justify-center bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:text-[#066a9e] ${canAddMore() ? "text-[#066a9e]" : "text-[#b9b9b9]"
                          }`}
                        disabled={!canAddMore()}
                        onClick={addEmailField}
                        aria-label="Add email field"
                      >
                        <Image
                          src="/assets/icons/plus-circle.svg"
                          alt="Add"
                          width={30}
                          height={30}
                        />
                      </button>
                    ) : (
                      <div className="w-[35px] h-[35px] flex-shrink-0"></div>
                    )}
                  </div>
                  {email.error && (
                    <span className="text-[12px] font-normal text-[#c10000] leading-normal">
                      {email.error}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center px-[35px]">
          <p className="text-[14px] font-medium text-[#333333] text-center leading-[1.3] m-0">
            招待メールを送信しました。
          </p>
        </div>
      )}
    </Modal>
  );
}
