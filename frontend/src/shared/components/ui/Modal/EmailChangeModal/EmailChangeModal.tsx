"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "../Modal";
import styles from "./EmailChangeModal.module.scss";
import { EmailChangeModalState } from "@/shared/types";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (newEmail: string, confirmEmail: string) => void;
  isSaving?: boolean;
  modalState?: EmailChangeModalState;
}

export function EmailChangeModal({
  isOpen,
  onClose,
  onSend,
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
      onSend(newEmail.trim(), confirmEmail.trim());
    }
  }, [newEmail, confirmEmail, onSend]);

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
      customClass={styles.emailChangeModal}
      isLoading={isSaving}
      actions={
        modalState === "email-change" ? (
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
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
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.btnSecondary}
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
          <div className={styles.modalDescription}>
            <p>新しいメールアドレス入力してください。</p>
            <p>メールアドレス再設定用URLを送信します。</p>
          </div>

          <div className={styles.formFields}>
            {/* New Email */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>新しいメールアドレス</label>
              <input
                type="email"
                className={styles.formInput}
                placeholder="メールアドレス"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            {/* Confirm Email */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>
                新しいメールアドレス（確認）
              </label>
              <input
                type="email"
                className={styles.formInput}
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
          <div className={`${styles.modalDescription} ${styles.centered}`}>
            <p>ご入力いただいたメールアドレスへ再設定用URLを送信しました。</p>
            <p>メール内のURLをクリックすると、</p>
            <p>メールアドレス変更が完了いたします。</p>
          </div>
        </>
      )}
    </Modal>
  );
}
