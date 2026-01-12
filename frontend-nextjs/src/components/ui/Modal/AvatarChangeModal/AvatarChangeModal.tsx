"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/components";
import { AVATAR_COLOR_OPTIONS } from "@/mocks";
import styles from "./AvatarChangeModal.module.scss";

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (color: string) => void;
  currentColor?: string;
  isSaving?: boolean;
}

export function AvatarChangeModal({
  isOpen,
  onClose,
  onSave,
  currentColor = "#8ec5d0",
  isSaving = false,
}: AvatarChangeModalProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  useEffect(() => {
    if (isOpen) {
      setSelectedColor(currentColor);
    }
  }, [isOpen, currentColor]);

  const handleSave = useCallback(() => {
    onSave(selectedColor);
  }, [selectedColor, onSave]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="アイコンカラーを選択"
      size="sm"
    >
      <div className={styles.colorGrid}>
        {AVATAR_COLOR_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.colorOption} ${
              selectedColor === option.color ? styles.selected : ""
            }`}
            style={{ backgroundColor: option.color }}
            onClick={() => setSelectedColor(option.color)}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className="modal-btn-secondary"
          onClick={onClose}
          disabled={isSaving}
        >
          キャンセル
        </button>
        <button
          type="button"
          className="modal-btn-primary-color"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "保存中..." : "保存"}
        </button>
      </div>
    </Modal>
  );
}
