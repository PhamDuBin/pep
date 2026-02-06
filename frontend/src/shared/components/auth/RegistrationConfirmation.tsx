"use client";

import type { UserType } from "@/shared/types/auth";
import Image from "next/image";

interface RegistrationConfirmationProps {
  userType: UserType;
}

export function RegistrationConfirmation({
  userType,
}: RegistrationConfirmationProps) {
  // Get localized title based on user type
  const title =
    userType === "buyer" ? "バイヤーアカウント作成" : "ベンダーアカウント作成";
  const registerPath =
    userType === "buyer" ? "/registration/buyer" : "/registration/vendor";

  return (
    <div className="bg-white relative w-full h-screen">
      {/* Confirmation Card - Centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f5f8fa]  flex flex-col gap-[15px] items-center p-[25px] rounded-lg shadow-[5px_5px_15px_0px_rgba(0,0,0,0.15)]">
        {/* Logo and Title Section */}
        <div className="flex flex-col gap-[5px] items-center justify-center">
          {/* PEP Logo */}
          <div className="flex flex-col h-[51px] items-end justify-center overflow-hidden w-[140px]">
            <div className="h-[48px] w-[150px]">
              <Image
                src="/assets/icons/logo-pep-login.svg"
                alt="PEP Logo"
                width={150}
                height={48}
              />
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center">
            <p className="font-bold text-[#333] text-[20px]">
              メールを送信しました
            </p>
          </div>
        </div>

        {/* Message Section */}
        <div className="flex h-full flex-col items-center">
          <div className="flex flex-col gap-[25px] items-center">
            {/* Main Message */}
            <div className="font-normal text-[#333] text-[14px] text-center gap-3">
              <p className="mb-6">メールに記載のURLから登録を続けてください</p>
              <p className="text-[#066a9e] mb-1">
                ※届かない場合は迷惑メールフォルダをご確認ください
              </p>
              <p className="text-[#066a9e]">
                ※メールアドレスを間違えた場合は再度登録し直してください
              </p>
            </div>

            {/* Return Button */}
            <a href={registerPath} className="!bg-[#066a9e] modal-btn-primary">
              <p className="font-normal text-[14px] text-white">
                登録画面に戻る
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
