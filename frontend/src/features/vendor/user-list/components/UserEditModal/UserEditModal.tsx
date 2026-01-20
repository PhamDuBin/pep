"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/shared/components";
import { PermissionOption } from "../../models";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveUser: (name: string, permission: string) => void;
  currentName?: string;
  currentPermission?: string;
  permissionOptions?: PermissionOption[];
  isSaving?: boolean;
}

const DEFAULT_PERMISSION_OPTIONS: PermissionOption[] = [
  { value: "管理者", label: "管理者" },
  { value: "メンバー", label: "メンバー" },
];

export function UserEditModal({
  isOpen,
  onClose,
  onSaveUser,
  currentName = "",
  currentPermission = "",
  permissionOptions = DEFAULT_PERMISSION_OPTIONS,
  isSaving = false,
}: UserEditModalProps) {
  const [name, setName] = useState(currentName);
  const [permission, setPermission] = useState(
    currentPermission || permissionOptions[0]?.value || ""
  );

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setPermission(currentPermission || permissionOptions[0]?.value || "");
    }
  }, [isOpen, currentName, currentPermission, permissionOptions]);

  const handleSaveUser = useCallback(() => {
    onSaveUser(name, permission);
  }, [name, permission, onSaveUser]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ユーザー情報の変更"
      size="sm"
    >
      <div className="flex flex-col gap-[20px] py-[10px] w-full">
        <div className="flex flex-col gap-[8px]">
          <label className="font-noto-jp text-[14px] text-[#333333]">氏名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="氏名を入力"
            className="py-[10px] px-[12px] border border-[#b9b9b9] rounded font-noto-jp text-[14px] text-[#333333] outline-none focus:border-[#066a9e] placeholder:text-[#808080]"
          />
        </div>
        <div className="flex flex-col gap-[8px]">
          <label className="font-noto-jp text-[14px] text-[#333333]">権限</label>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            className="py-[10px] px-[12px] border border-[#b9b9b9] rounded font-noto-jp text-[14px] text-[#333333] outline-none focus:border-[#066a9e]"
          >
            {permissionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-center gap-[10px] pt-[20px] w-full">
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
          onClick={handleSaveUser}
          disabled={isSaving || !name.trim()}
        >
          {isSaving ? "保存中..." : "保存"}
        </button>
      </div>
    </Modal>
  );
}
