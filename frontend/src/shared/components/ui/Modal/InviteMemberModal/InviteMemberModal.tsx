"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "../Modal";
import styles from "./InviteMemberModal.module.scss";
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
      customClass={`${styles.inviteMemberModal} ${modalState === "complete" ? styles.completeState : ""}`}
      isLoading={isSaving}
      actions={
        modalState === "form" ? (
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className={styles.btnSend}
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
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "form" ? (
        <div className={styles.inviteFormContent}>
          {/* Description text */}
          <div className={styles.descriptionText}>
            <p>追加したいメンバーのメールアドレスを入力してください。</p>
            <p>入力したメールアドレス宛に招待メールを送信します。</p>
            <p className={styles.note}>※ 招待メールの有効期限は10日間です。</p>
          </div>

          {/* Email inputs */}
          <div className={styles.emailInputsContainer}>
            {emails.map((email, index) => {
              const isLast = index === emails.length - 1;
              return (
                <div key={index} className={styles.emailFieldWrapper}>
                  <div className={styles.emailInputRow}>
                    <input
                      type="email"
                      className={`${styles.emailInput} ${
                        email.error ? styles.hasError : ""
                      }`}
                      placeholder="email@address.com"
                      value={email.value}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    {isLast ? (
                      <button
                        type="button"
                        className={`${styles.addBtn} ${
                          canAddMore() ? styles.active : ""
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
                      <div className={styles.addBtnSpacer}></div>
                    )}
                  </div>
                  {email.error && (
                    <span className={styles.errorMessage}>{email.error}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.completeContent}>
          <p className={styles.completeMessage}>招待メールを送信しました。</p>
        </div>
      )}
    </Modal>
  );
}
