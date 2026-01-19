"use client";

import { UserProfile } from "../models";
import Image from "next/image";

interface UserInfoSectionProps {
  user: UserProfile;
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  showAvatarSaveSuccess: boolean;
  showPasswordSaveSuccess: boolean;
  isSaving: boolean;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setShowPassword: (value: boolean) => void;
  setShowConfirmPassword: (value: boolean) => void;
  onAvatarClick: () => void;
  onEmailChangeClick: () => void;
  onSaveClick: () => void;
}

export function UserInfoSection({
  user,
  newPassword,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  showAvatarSaveSuccess,
  showPasswordSaveSuccess,
  isSaving,
  setNewPassword,
  setConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  onAvatarClick,
  onEmailChangeClick,
  onSaveClick,
}: UserInfoSectionProps) {
  return (
    <div className="flex flex-col gap-[25px] w-full">
      {/* Section Header */}
      <div className="flex items-center pb-[10px] border-b border-[#cfcfcf]">
        <h2 className="font-bold text-[20px] leading-normal text-[#333] m-0">
          ユーザー情報
        </h2>
      </div>

      {/* Section Content */}
      <div className="flex flex-col gap-[25px] items-center justify-center w-full">
        {/* Avatar Row */}
        <div className="flex items-center gap-[25px] w-full">
          <div
            className="w-[70px] h-[70px] rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-200 hover:opacity-80"
            style={{ backgroundColor: user.avatarColor || "#8ec5d0" }}
            onClick={onAvatarClick}
          >
            <span className="font-normal text-[24px] text-white">
              {user.initials}
            </span>
          </div>
          <button
            type="button"
            className="flex items-center px-[15px] py-[10px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333] cursor-pointer transition-colors duration-200 hover:bg-[#d1d1d1]"
            onClick={onAvatarClick}
          >
            画像を選択
          </button>
        </div>

        {/* Success Message - shows for both avatar and password save */}
        {(showAvatarSaveSuccess || showPasswordSaveSuccess) && (
          <div className="flex items-center justify-center px-[20px] py-[10px] bg-[#e6f3f5] rounded-[4px] self-start">
            <span className="font-semibold text-[14px] leading-normal text-[#066a9e]">
              変更を保存しました。
            </span>
          </div>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-[10px] items-start w-full">
          {/* Name Field */}
          <div className="flex items-center gap-[10px]">
            <label className="w-[200px] font-normal text-[16px] text-black">
              氏名
            </label>
            <div className="flex items-center h-[35px] px-[10px] py-[3px] bg-white rounded-[4px] w-[300px]">
              <span className="font-normal text-[16px] text-black">
                {user.name}
              </span>
            </div>
          </div>

          {/* Email Field */}
          <div className="flex items-center gap-[10px]">
            <label className="w-[200px] font-normal text-[16px] text-black">
              メールアドレス
            </label>
            <div className="flex items-center h-[35px] px-[10px] py-[3px] bg-white rounded-[4px] w-auto gap-[25px]">
              <span className="font-normal text-[16px] text-black">
                {user.email}
              </span>
              <button
                type="button"
                className="bg-transparent border-none font-normal text-[16px] text-[#066a9e] underline cursor-pointer p-0 hover:opacity-80"
                onClick={onEmailChangeClick}
              >
                メールアドレスを変更
              </button>
            </div>
          </div>

          {/* Current Password Field */}
          <div className="flex items-center gap-[10px]">
            <label className="w-[200px] font-normal text-[16px] text-black">
              現在のパスワード
            </label>
            <div className="flex items-center h-[35px] px-[10px] py-[3px] bg-white rounded-[4px] w-[300px]">
              <span className="font-normal text-[16px] text-black">
                **********
              </span>
            </div>
          </div>

          {/* New Password Field */}
          <div className="flex items-center gap-[10px]">
            <label className="w-[200px] font-normal text-[16px] text-black">
              新しいパスワード
            </label>
            <div className="flex items-center justify-between h-[35px] px-[10px] py-[3px] bg-white border border-[#b9b9b9] rounded-[4px] w-[300px] box-border">
              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 border-none outline-none font-normal text-[16px] text-black bg-transparent placeholder:text-[#808080]"
                placeholder="8〜16文字の英数字で入力"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer shrink-0 hover:opacity-70"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Image
                    src="/assets/icons/eye-off.svg"
                    alt="Eye Icon"
                    width={24}
                    height={24}
                  />
                ) : (
                  <Image
                    src="/assets/icons/mdi-eye.svg"
                    alt="Eye Icon"
                    width={24}
                    height={24}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="flex items-center gap-[10px]">
            <label className="w-[200px] font-normal text-[16px] text-black">
              新しいパスワード（確認）
            </label>
            <div className="flex items-center justify-between h-[35px] px-[10px] py-[3px] bg-white border border-[#b9b9b9] rounded-[4px] w-[300px] box-border">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="flex-1 border-none outline-none font-normal text-[16px] text-black bg-transparent placeholder:text-[#808080]"
                placeholder="8〜16文字の英数字で入力"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer shrink-0 hover:opacity-70"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Image
                    src="/assets/icons/eye-off.svg"
                    alt="Eye Icon"
                    width={24}
                    height={24}
                  />
                ) : (
                  <Image
                    src="/assets/icons/mdi-eye.svg"
                    alt="Eye Icon"
                    width={24}
                    height={24}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center w-full">
          <button
            type="button"
            className="flex items-center px-[15px] py-[10px] bg-[#066a9e] border-none rounded-[8px] font-normal text-[14px] text-white cursor-pointer transition-colors duration-200 hover:enabled:bg-[#055a84] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSaving}
            onClick={onSaveClick}
          >
            {isSaving ? "保存中..." : "変更を保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
