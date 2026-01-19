"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/shared/components";
import { UserPermission, PermissionChangeModalState } from "../../types/types";
import { PERMISSION_OPTIONS, PERMISSION_LABELS } from "../../mock";
import Image from "next/image";

interface PermissionTableRow {
  feature: string;
  adminCheck?: boolean;
  adminText?: string;
  adminNote?: string;
  memberCheck?: boolean;
  memberText?: string;
  memberNote?: string;
}

interface PermissionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionSaveClick: (permission: UserPermission) => void;
  currentPermission?: UserPermission;
  userName?: string;
  isSaving?: boolean;
  modalState?: PermissionChangeModalState;
}

// Permission comparison table data (matches Figma design)
const PERMISSION_TABLE_DATA: PermissionTableRow[] = [
  {
    feature: "アカウント・組織",
    adminText: "組織設定の変更/メンバー招待・権限変更/退会",
    memberText: "自分のプロフィール変更",
  },
  {
    feature: "プロジェクト計画書作成（AI）",
    adminCheck: true,
    memberCheck: true,
  },
  {
    feature: "ベンダー選定",
    adminCheck: true,
    adminNote: "（選定/送信先確定）",
  },
  {
    feature: "RFP送信（メール/チャット）",
    adminCheck: true,
  },
  {
    feature: "チャット（発注者↔︎ベンダー）",
    adminCheck: true,
    adminNote: "(送受信/クローズ)",
    memberCheck: true,
    memberNote: "(招待時)",
  },
  {
    feature: "アーカイブ",
    adminCheck: true,
    memberCheck: true,
  },
  {
    feature: "決済/請求",
    adminCheck: true,
    adminNote: "(Stripe手続)",
  },
];

export function PermissionChangeModal({
  isOpen,
  onClose,
  onPermissionSaveClick,
  currentPermission = "member",
  userName = "",
  isSaving = false,
  modalState = "select",
}: PermissionChangeModalProps) {
  const [selectedPermission, setSelectedPermission] =
    useState<UserPermission>(currentPermission);

  useEffect(() => {
    if (isOpen && modalState === "select") {
      setSelectedPermission(currentPermission);
    }
  }, [isOpen, currentPermission, modalState]);

  const handleConfirm = useCallback(() => {
    onPermissionSaveClick(selectedPermission);
  }, [selectedPermission, onPermissionSaveClick]);

  const getPermissionLabel = (permission: UserPermission | null): string => {
    if (!permission) return "";
    return PERMISSION_LABELS[permission] || permission;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="権限変更"
      size="lg"
      customClass="w-[800px] max-w-[800px] p-[20px_35px] gap-[25px] [&_.modal-title]:text-[20px] [&_.modal-body]:gap-[25px] [&_.modal-actions]:flex [&_.modal-actions]:flex-row [&_.modal-actions]:gap-[10px] [&_.modal-actions]:justify-center [&_.modal-actions]:items-center"
      isLoading={isSaving}
      actions={
        modalState === "select" ? (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="px-[15px] py-[10px] bg-[#066a9e] border-none rounded-[8px] font-normal text-[14px] text-white cursor-pointer transition-colors duration-200 min-w-[80px] flex items-center justify-center hover:enabled:bg-[#055a85] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || !selectedPermission}
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
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="px-[15px] py-[10px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333] cursor-pointer transition-colors duration-200 min-w-[80px] flex items-center justify-center hover:bg-[#999797]"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "select" ? (
        <>
          {/* Permission Selection Mode */}
          <div className="flex flex-col items-center gap-[10px]">
            <p className="font-medium text-[14px] leading-[1.3] text-black text-center m-0">
              このユーザーを以下の権限へ変更します。
            </p>

            {/* Radio Buttons (Horizontal) */}
            <div className="flex items-center gap-[25px] h-[40px]">
              {PERMISSION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-[5px] cursor-pointer rounded-[4px]"
                >
                  <div
                    className={`w-[18px] h-[18px] border-2 rounded-full bg-white flex items-center justify-center transition-all duration-200 shrink-0 hover:border-[#333333] ${selectedPermission === option.value
                      ? "border-[#333333]"
                      : "border-[#b9b9b9]"
                      }`}
                  >
                    {selectedPermission === option.value && (
                      <div className="w-[10px] h-[10px] rounded-full bg-[#333333]"></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="permission"
                    value={option.value}
                    checked={selectedPermission === option.value}
                    onChange={() =>
                      setSelectedPermission(option.value as UserPermission)
                    }
                    className="hidden"
                  />
                  <span className="text-[14px] font-normal leading-[18px] text-[#333]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Permissions Table */}
          <div className="border border-[#d4d4d4] rounded-[10px] w-full overflow-hidden">
            <table className="w-full border-collapse ">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="px-[12px] py-[15px] font-semibold text-[14px] leading-[1.3] text-[#333] text-center border-b border-[#d4d4d4]">
                    機能
                  </th>
                  <th className="px-[12px] py-[15px] font-semibold text-[14px] leading-[1.3] text-[#333] text-center border-b border-[#d4d4d4] w-[224px]">
                    管理者
                  </th>
                  <th className="px-[12px] py-[15px] font-semibold text-[14px] leading-[1.3] text-[#333] text-center border-b border-[#d4d4d4]">
                    メンバー
                  </th>
                </tr>
              </thead>
              <tbody>
                {PERMISSION_TABLE_DATA.map((row, index) => (
                  <tr key={index}>
                    <td
                      className={`px-[12px] py-[10px] font-medium text-[14px] leading-[1.3] text-[#333] text-center align-middle min-h-[44px] ${index !== PERMISSION_TABLE_DATA.length - 1
                        ? "border-b border-[#d4d4d4]"
                        : ""
                        }`}
                    >
                      {row.feature}
                    </td>
                    <td
                      className={`px-[12px] py-[10px] font-medium text-[14px] leading-[1.3] text-[#333] text-center align-middle min-h-[44px] ${index !== PERMISSION_TABLE_DATA.length - 1
                        ? "border-b border-[#d4d4d4]"
                        : ""
                        }`}
                    >
                      {row.adminCheck ? (
                        <div className="flex flex-col items-center justify-center">
                          <Image
                            src="/assets/icons/check-light.svg"
                            alt="Project Plan"
                            width={24}
                            height={24}
                          />
                          {row.adminNote && (
                            <span className="text-[14px] font-medium text-[#333]">
                              {row.adminNote}
                            </span>
                          )}
                        </div>
                      ) : row.adminText ? (
                        <span className="text-[14px] font-medium text-[#333]">
                          {row.adminText}
                        </span>
                      ) : null}
                    </td>
                    <td
                      className={`px-[12px] py-[10px] font-medium text-[14px] leading-[1.3] text-[#333] text-center align-middle min-h-[44px] ${index !== PERMISSION_TABLE_DATA.length - 1
                        ? "border-b border-[#d4d4d4]"
                        : ""
                        }`}
                    >
                      {row.memberCheck ? (
                        <div className="flex flex-col items-center justify-center">
                          <Image
                            src="/assets/icons/check-light.svg"
                            alt="Project Plan"
                            width={24}
                            height={24}
                          />
                          {row.memberNote && (
                            <span className="text-[14px] font-medium text-[#333]">
                              {row.memberNote}
                            </span>
                          )}
                        </div>
                      ) : row.memberText ? (
                        <span className="text-[14px] font-medium text-[#333]">
                          {row.memberText}
                        </span>
                      ) : null}
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
          <div className="flex flex-col items-center gap-[10px]">
            <p className="font-medium text-[14px] leading-[1.3] text-black text-center m-0">
              ユーザーを以下の権限へ変更しました。
            </p>
            <div className="flex items-center justify-center h-[40px]">
              <span className="text-[14px] text-[#333]">
                {getPermissionLabel(selectedPermission)}
              </span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
