"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/components";
import styles from "./EmailChangeModal.module.scss";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (newEmail: string, confirmEmail?: string) => void;
  mode?: "single" | "confirm";
  description?: string;
  isSaving?: boolean;
}

export function EmailChangeModal({
  isOpen,
  onClose,
  onSend,
  mode = "confirm",
  description,
  isSaving = false,
}: EmailChangeModalProps) {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewEmail("");
      setConfirmEmail("");
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setNewEmail("");
    setConfirmEmail("");
    onClose();
  }, [onClose]);

  const handleSend = useCallback(() => {
    if (mode === "single") {
      onSend(newEmail);
    } else {
      onSend(newEmail, confirmEmail);
    }
    setNewEmail("");
    setConfirmEmail("");
  }, [newEmail, confirmEmail, onSend, mode]);

  const isValid = mode === "single"
    ? newEmail.trim() !== ""
    : newEmail.trim() !== "" && confirmEmail.trim() !== "" && newEmail === confirmEmail;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="メールアドレスの変更"
      size="sm"
    >
      <div className={styles.content}>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        <div className={styles.formGroup}>
          <label>新しいメールアドレス</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={mode === "single" ? "email@example.com" : "新しいメールアドレスを入力"}
          />
        </div>
        {mode === "confirm" && (
          <div className={styles.formGroup}>
            <label>新しいメールアドレス（確認）</label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="新しいメールアドレスを再入力"
            />
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className="modal-btn-secondary"
          onClick={handleClose}
          disabled={isSaving}
        >
          キャンセル
        </button>
        <button
          type="button"
          className="modal-btn-primary-color"
          onClick={handleSend}
          disabled={!isValid || isSaving}
        >
          {isSaving ? "送信中..." : "送信"}
        </button>
      </div>
    </Modal>
  );
}
