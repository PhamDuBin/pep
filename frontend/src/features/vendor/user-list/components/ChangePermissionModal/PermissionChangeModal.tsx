"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/shared/components";
import { VendorUserPermission } from "../../mock";
import {
  VENDOR_PERMISSION_OPTIONS_MOCK,
  VENDOR_PERMISSION_LABELS_MOCK,
} from "../../mock";
import Image from "next/image";

export type ChangePermissionModalState = "select" | "complete";

interface ChangePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionSaveClick: (permission: VendorUserPermission) => void;
  currentPermission?: VendorUserPermission;
  isSaving?: boolean;
}

interface PermissionTableRow {
  feature: string;
  adminCheck?: boolean;
  adminText?: string;
  memberCheck?: boolean;
  memberText?: string;
}

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

export function PermissionChangeModal({
  isOpen,
  onClose,
  onPermissionSaveClick,
  currentPermission,
  isSaving = false,
}: ChangePermissionModalProps) {
  const [modalState, setModalState] =
    useState<ChangePermissionModalState>("select");
  const [selectedPermission, setSelectedPermission] =
    useState<VendorUserPermission>(currentPermission || "メンバー");

  useEffect(() => {
    if (isOpen) {
      setModalState("select");
      setSelectedPermission(currentPermission || "メンバー");
    }
  }, [isOpen, currentPermission]);

  const handleSaveClick = useCallback(() => {
    onPermissionSaveClick(selectedPermission);
    setModalState("complete");
  }, [selectedPermission, onPermissionSaveClick]);

  const getPermissionLabel = (permission: VendorUserPermission) => {
    return VENDOR_PERMISSION_LABELS_MOCK[permission] || permission;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={modalState === "complete" ? "sm" : "xl"}
      customClass={
        modalState === "complete"
          ? "!w-[500px] !max-w-[500px] !h-[224px] !py-[20px] !px-[35px] !gap-[25px] !rounded-xl !overflow-hidden"
          : "w-[800px] max-w-[800px] py-5 px-[35px] gap-[25px] rounded-xl"
      }
      isLoading={isSaving}
      actions={
        modalState === "select" ? (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="flex flex-row items-center justify-center py-[10px] px-[15px] gap-[10px] w-[58px] h-[39px] bg-[#066A9E] rounded-[8px] border-none font-noto font-[400] text-[14px] leading-[19px] text-[#FFFFFF] cursor-pointer transition-colors duration-200 hover:bg-[#055580] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || selectedPermission === currentPermission}
              onClick={handleSaveClick}
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
              className="flex justify-center items-center py-[10px] px-[15px] gap-[10px] w-[72px] h-[39px] bg-[#e1e1e1] rounded-[8px] border-none cursor-pointer transition-colors duration-200 font-noto font-[400] text-[14px] leading-[19px] text-[#333333] hover:bg-[#d4d4d4]"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      <div className="font-noto font-normal text-[20px] leading-[100%] text-[#066A9E] text-center w-full m-0 p-0 mb-[25px]">
        権限変更
      </div>
      {modalState === "select" ? (
        <>
          {/* Permission Selection Mode */}
          <div className="flex flex-col items-center p-0 gap-[10px] w-full mb-[25px]">
            <p className="font-noto-jp font-medium text-[14px] leading-[130%] text-center text-[#333333] m-0 w-[265px]">
              このユーザーを以下の権限へ変更します。
            </p>

            {/* Radio Buttons (Horizontal) */}
            <div className="flex flex-row items-center justify-center p-0 gap-[25px] h-[40px]">
              {VENDOR_PERMISSION_OPTIONS_MOCK.map((option) => (
                <label
                  key={option.value}
                  className="flex flex-row items-center gap-[5px] cursor-pointer"
                >
                  <div className="relative w-[24px] h-[24px]">
                    <input
                      type="radio"
                      name="permission"
                      value={option.value}
                      checked={selectedPermission === option.value}
                      onChange={() =>
                        setSelectedPermission(
                          option.value as VendorUserPermission
                        )
                      }
                      className="appearance-none w-[24px] h-[24px] bg-white border border-[#e5e7eb] rounded-full cursor-pointer
                        checked:border-[#1f2937]"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <div
                        className={`w-[16px] h-[16px] bg-[#1f2937] rounded-full transition-opacity ${selectedPermission === option.value
                          ? "opacity-100"
                          : "opacity-0"
                          }`}
                      ></div>
                    </div>
                  </div>
                  <span className="font-noto-jp font-normal text-[14px] leading-[18px] text-[#333333]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Permissions Table - Flexbox Layout matching Figma */}
          {/* Using flex-1 and w-full instead of fixed widths inside to avoid border overflow issues */}
          <div className="box-border w-[730px] bg-white border border-[#d4d4d4] rounded-[4px] overflow-hidden mx-auto">
            <div className="flex flex-col items-start p-0 w-full font-noto-jp">
              {/* Header Row */}
              <div className="flex flex-row items-start p-0 w-full h-[50px] bg-[rgba(255,255,255,0.0001)]">
                <div className="flex flex-col justify-center items-center p-0 flex-1 h-[50px] bg-[#f5f5f5]">
                  <div className="flex flex-row items-start py-[15px] px-[12px] w-full h-[48px]">
                    <span className="font-inter font-semibold text-[14px] leading-[130%] text-[#333333] text-center flex-grow">
                      機能
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center p-0 flex-1 h-[50px] bg-[#f5f5f5]">
                  <div className="flex flex-row items-start py-[15px] px-[12px] w-full h-[48px]">
                    <span className="font-inter font-semibold text-[14px] leading-[130%] text-[#333333] text-center flex-grow">
                      管理者
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center p-0 flex-1 h-[50px] bg-[#f5f5f5]">
                  <div className="flex flex-row items-start py-[15px] px-[12px] w-full h-[48px]">
                    <span className="font-inter font-semibold text-[14px] leading-[130%] text-[#333333] text-center flex-grow">
                      メンバー
                    </span>
                  </div>
                </div>
              </div>

              {/* Body Rows */}
              {PERMISSION_TABLE_DATA.map((row, index) => {
                const rowHeight = index === 0 ? 56 : 62;
                return (
                  <div
                    key={index}
                    className="flex flex-row justify-center items-center p-0 w-full bg-[rgba(255,255,255,0.0001)]"
                    style={{ height: `${rowHeight}px` }}
                  >
                    {/* Feature Cell */}
                    <div
                      className="flex flex-col justify-center items-center p-0 flex-1 bg-[rgba(255,255,255,0.002)] border-t border-[#d4d4d4]"
                      style={{ height: `${rowHeight}px` }}
                    >
                      <div className="flex flex-row justify-center items-center py-[10px] px-[12px] w-full h-[38px]">
                        <span className="font-noto-jp font-medium text-[14px] leading-[130%] text-[#333333] text-center flex-grow">
                          {row.feature}
                        </span>
                      </div>
                    </div>

                    {/* Admin Cell */}
                    <div
                      className="flex flex-col justify-center items-center p-0 flex-1 bg-[rgba(255,255,255,0.002)] border-t border-[#d4d4d4]"
                      style={{ height: `${rowHeight}px` }}
                    >
                      <div
                        className="flex flex-col justify-center items-center py-[10px] px-[12px] w-full"
                        style={{ height: `${rowHeight}px` }}
                      >
                        {row.adminCheck && (
                          <Image
                            src="/assets/icons/check-light.svg"
                            alt="Project Plan"
                            width={24}
                            height={24}
                          />
                        )}
                        {row.adminText && (
                          <span className="font-noto-jp font-medium text-[14px] leading-[130%] text-[#333333] text-center">
                            {row.adminText}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Cell */}
                    <div
                      className="flex flex-col justify-center items-center p-0 flex-1 bg-[rgba(255,255,255,0.002)] border-t border-[#d4d4d4]"
                      style={{ height: `${rowHeight}px` }}
                    >
                      <div
                        className="flex flex-col justify-center items-center py-[10px] px-[12px] w-full"
                        style={{ height: `${rowHeight}px` }}
                      >
                        {row.memberCheck && (
                          <Image
                            src="/assets/icons/check-light.svg"
                            alt="Project Plan"
                            width={24}
                            height={24}
                          />
                        )}
                        {row.memberText && (
                          <span className="font-noto-jp font-medium text-[14px] leading-[130%] text-[#333333] text-center">
                            {row.memberText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Completion Mode */}
          {/* Completion Mode - Frame 121 + Frame 51 structure */}
          <div className="flex flex-col items-center gap-[10px] w-[252px] h-[68px] justify-center p-0 mb-0">
            <p className="font-noto-jp font-medium text-[14px] leading-[130%] text-center text-[#333333] m-0 w-full">
              ユーザーを以下の権限へ変更しました。
            </p>
            <div className="flex items-center justify-center h-[40px] gap-[25px] w-auto">
              {/* Frame 51 inner */}
              <span className="font-noto-jp font-[400] text-[14px] leading-[18px] text-[#333333]">
                {getPermissionLabel(selectedPermission)}
              </span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
