"use client";

import { Modal } from "@/components";
import styles from "./InfoModal.module.scss";

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className={styles.content}>
        {typeof message === "string" ? (
          <p className={styles.message}>{message}</p>
        ) : (
          message
        )}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className="modal-btn-primary-color"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
}
