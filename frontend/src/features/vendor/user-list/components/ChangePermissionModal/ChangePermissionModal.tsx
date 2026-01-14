"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/shared/components";
import { VendorUserPermission } from "../../mock";
import { VENDOR_PERMISSION_OPTIONS_MOCK, VENDOR_PERMISSION_LABELS_MOCK } from "../../mock";
import styles from "./ChangePermissionModal.module.scss";

export type ChangePermissionModalState = "select" | "complete";

interface PermissionTableRow {
  feature: string;
  adminCheck?: boolean;
  adminText?: string;
  memberCheck?: boolean;
  memberText?: string;
}

interface ChangePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permission: VendorUserPermission) => void;
  currentPermission?: VendorUserPermission;
  userName?: string;
  isSaving?: boolean;
  modalState?: ChangePermissionModalState;
}

// Permission comparison table data (matches Figma design)
const PERMISSION_TABLE_DATA: PermissionTableRow[] = [
  {
    feature: "アカウント・組織",
    adminText: "組織設定の変更/メンバー招待・権限変更/退会",
    memberText: "自分のプロフィール変更",
  },
  {
    feature: "チャット（発注者↔︎ベンダー）",
    adminCheck: true,
    adminText: "(送受信/クローズ)",
    memberCheck: true,
    memberText: "(送受信)※招待された時のみ",
  },
  {
    feature: "決済/請求",
    adminCheck: true,
    adminText: "(請求)",
    memberText: "",
  },
];

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M9.55008 17.3081L4.58008 12.3381L5.29408 11.6251L9.55008 15.8811L18.7061 6.7251L19.4191 7.4391L9.55008 17.3081Z"
      fill="#066A9E"
    />
  </svg>
);

export function ChangePermissionModal({
  isOpen,
  onClose,
  onConfirm,
  currentPermission = "メンバー",
  userName = "",
  isSaving = false,
  modalState = "select",
}: ChangePermissionModalProps) {
  const [selectedPermission, setSelectedPermission] =
    useState<VendorUserPermission>(currentPermission);

  useEffect(() => {
    if (isOpen && modalState === "select") {
      setSelectedPermission(currentPermission);
    }
  }, [isOpen, currentPermission, modalState]);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedPermission);
  }, [selectedPermission, onConfirm]);

  const getPermissionLabel = (permission: VendorUserPermission | null): string => {
    if (!permission) return "";
    return VENDOR_PERMISSION_LABELS_MOCK[permission] || permission;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="權限變更"
      size={modalState === "complete" ? "sm" : "lg"}
      customClass={`${styles.permissionChangeModal} ${
        modalState === "complete" ? styles.completeState : ""
      }`}
      isLoading={isSaving}
      actions={
        modalState === "select" ? (
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.btnSave}
              disabled={isSaving || selectedPermission === currentPermission}
              onClick={handleConfirm}
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "保存"
              )}
            </button>
          </div>
        ) : (
          <div className={styles.actionsRow}>
            <button type="button" className={styles.btnClose} onClick={onClose}>
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "select" ? (
        <>
          {/* Permission Selection Mode */}
          <div className={styles.selectionContainer}>
            <p className={styles.modalText}>
              このユーザーを以下の権限へ変更します。
            </p>

            {/* Radio Buttons (Horizontal) */}
            <div className={styles.radioGroup}>
              {VENDOR_PERMISSION_OPTIONS_MOCK.map((option) => (
                <label key={option.value} className={styles.radioLabel}>
                  <div
                    className={`${styles.radioCircle} ${
                      selectedPermission === option.value ? styles.selected : ""
                    }`}
                  >
                    {selectedPermission === option.value && (
                      <div className={styles.radioDot}></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="permission"
                    value={option.value}
                    checked={selectedPermission === option.value}
                    onChange={() =>
                      setSelectedPermission(option.value as VendorUserPermission)
                    }
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.radioText}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Permissions Table */}
          <div className={styles.permissionTableContainer}>
            <table className={styles.permissionTable}>
              <thead>
                <tr>
                  <th>機能</th>
                  <th className={styles.adminColumn}>管理者</th>
                  <th>メンバー</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSION_TABLE_DATA.map((row, index) => (
                  <tr key={index}>
                    <td>{row.feature}</td>
                    <td>
                      {row.adminCheck && (
                        <div className={styles.checkContainer}>
                          <CheckIcon />
                        </div>
                      )}
                      {row.adminText && (
                        <span className={styles.cellText}>{row.adminText}</span>
                      )}
                    </td>
                    <td>
                      {row.memberCheck && (
                        <div className={styles.checkContainer}>
                          <CheckIcon />
                        </div>
                      )}
                      {row.memberText && (
                        <span className={styles.cellText}>
                          {row.memberText}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Completion Mode */}
          <div className={styles.completeContainer}>
            <p className={styles.modalText}>
              ユーザーを以下の権限へ変更しました。
            </p>
            <div className={styles.completedPermission}>
              <span>{getPermissionLabel(selectedPermission)}</span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
