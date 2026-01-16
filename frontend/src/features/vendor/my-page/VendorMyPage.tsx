"use client";

import Image from "next/image";
import { EmailChangeModal, AvatarChangeModal, PageTransition } from "@/shared/components";
import { InfoModal } from "@/features/vendor/shared/components";
import { useVendorMyPage } from "./hooks";

export function VendorMyPage() {
  const {
    isLoading,
    userProfile,
    paymentInfo,
    paymentHistory,
    newPassword,
    confirmPassword,
    showNewPassword,
    showConfirmPassword,
    showEmailModal,
    showEmailSuccessModal,
    showAvatarModal,
    setNewPassword,
    setConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    setShowEmailModal,
    setShowEmailSuccessModal,
    setShowAvatarModal,
    handleEmailChange,
    handleEmailSent,
    handleAvatarUpload,
    handleAvatarColorChange,
    handleSaveChanges,
    handleDownloadInvoice,
  } = useVendorMyPage();

  if (isLoading || !userProfile || !paymentInfo) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center py-[25px] px-[50px] gap-[50px] w-full min-h-screen">
          <div className="text-center">Loading...</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col items-center py-[25px] px-[50px] gap-[50px] w-full min-h-screen">
        {/* Section 1: User Information */}
        <div className="flex flex-col items-start gap-[25px] w-full">
          {/* Full-width header with border */}
          <div className="flex flex-row items-center py-0 px-0 pb-[10px] gap-[10px] w-full h-[37px] border-b border-[#CFCFCF]">
            <h2 className="font-noto font-[700] text-[20px] leading-[27px] text-[#333333]">
              ユーザー情報
            </h2>
          </div>

          {/* Content with max-width */}
          <div className="flex flex-col justify-center items-center gap-[25px] w-full max-w-[1008px]">
            {/* User Info Content */}
            <div className="flex flex-col justify-center items-start gap-[25px] w-full">
              {/* Avatar Section - Horizontal Layout */}
              <div className="flex flex-row items-center gap-[25px] w-full h-[70px]">
                <div className="flex flex-row items-center gap-[25px] w-[195px] h-[70px]">
                  <div
                    className="w-[70px] h-[70px] rounded-full flex items-center justify-center"
                    style={{ backgroundColor: userProfile.avatarColor }}
                  >
                    {userProfile.avatarUrl ? (
                      <Image
                        src={userProfile.avatarUrl}
                        alt={userProfile.name}
                        width={70}
                        height={70}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="font-noto font-[400] text-[13px] text-white">{userProfile.initials}</span>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-[10px] w-[100px] h-[39px]">
                    <button
                      type="button"
                      className="flex flex-row items-center py-[10px] px-[15px] gap-[10px] w-[100px] h-[39px] bg-[#E1E1E1] rounded-[8px] border-none cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0]"
                      onClick={handleAvatarUpload}
                    >
                      <span className="font-noto font-[400] text-[14px] leading-[19px] text-[#333333] w-[70px] h-[19px]">
                        画像を選択
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col items-start gap-[10px] w-[539px]">
                {/* Name Field */}
                <div className="flex flex-row items-center gap-[10px] w-[510px] h-[35px]">
                  <div className="flex flex-row items-center gap-[10px] w-[200px] h-[22px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333] w-[32px] h-[22px]">
                      氏名
                    </span>
                  </div>
                  <div className="flex flex-row items-center py-[3px] px-[10px] gap-[10px] w-[300px] h-[35px] bg-white rounded-[4px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333]">
                      {userProfile.name}
                    </span>
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-row items-center gap-[10px] w-full h-[35px]">
                  <div className="flex flex-row items-center gap-[10px] w-[200px] h-[22px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333] w-[112px] h-[22px]">
                      メールアドレス
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-[25px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333]">
                      {userProfile.email}
                    </span>
                    <button
                      type="button"
                      className="font-noto font-[400] text-[16px] leading-[22px] text-[#066A9E] underline bg-transparent border-none cursor-pointer whitespace-nowrap"
                      onClick={handleEmailChange}
                    >
                      メールアドレスを変更
                    </button>
                  </div>
                </div>

                {/* Current Password */}
                <div className="flex flex-row items-center gap-[10px] w-[510px] h-[35px]">
                  <div className="flex flex-row items-center gap-[10px] w-[200px] h-[22px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333] w-[128px] h-[22px]">
                      現在のパスワード
                    </span>
                  </div>
                  <div className="flex flex-row items-center py-[3px] px-[10px] gap-[10px] w-[300px] h-[35px] bg-white rounded-[4px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333]">
                      **********
                    </span>
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-row items-center gap-[10px] w-[510px] h-[35px]">
                  <div className="flex flex-row items-center gap-[10px] w-[200px] h-[22px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333] w-[128px] h-[22px]">
                      新しいパスワード
                    </span>
                  </div>
                  <div className="flex flex-row justify-between items-center py-[3px] px-[10px] gap-[10px] w-[300px] h-[35px] bg-white border border-[#B9B9B9] rounded-[4px]">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="●●●●●●●●●●"
                      className="flex-1 font-noto font-[400] text-[16px] leading-[22px] text-[#333333] bg-transparent border-none outline-none text-center"
                    />
                    <button
                      type="button"
                      className="w-[24px] h-[24px] bg-transparent border-none cursor-pointer p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <svg
                        className="w-[24px] h-[24px]"
                        fill="#808080"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-row items-center gap-[10px] w-[510px] h-[35px]">
                  <div className="flex flex-row items-center gap-[10px] w-[200px] h-[22px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333] w-[192px] h-[22px]">
                      新しいパスワード（確認）
                    </span>
                  </div>
                  <div className="flex flex-row justify-between items-center py-[3px] px-[10px] gap-[10px] w-[300px] h-[35px] bg-white border border-[#B9B9B9] rounded-[4px]">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="●●●●●●●●●●"
                      className="flex-1 font-noto font-[400] text-[16px] leading-[22px] text-[#333333] bg-transparent border-none outline-none text-center"
                    />
                    <button
                      type="button"
                      className="w-[24px] h-[24px] bg-transparent border-none cursor-pointer p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <svg
                        className="w-[24px] h-[24px]"
                        fill="#808080"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button - Right aligned */}
            <div className="flex flex-row justify-end items-center w-full">
              <button
                type="button"
                className="flex flex-row items-center justify-center py-[10px] px-[15px] gap-[10px] w-[100px] h-[39px] bg-[#066A9E] rounded-[8px] border-none cursor-pointer transition-colors duration-200 hover:bg-[#055580]"
                onClick={handleSaveChanges}
              >
                <span className="font-noto font-[400] text-[14px] leading-[19px] text-white w-[70px] h-[19px]">
                  変更を保存
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Information */}
        <div className="flex flex-col items-start gap-[25px] w-full">
          {/* Full-width header with border */}
          <div className="flex flex-row items-center gap-[10px] w-full h-[27px]">
            <h2 className="font-noto font-[700] text-[20px] leading-[27px] text-[#333333]">
              決済情報
            </h2>
          </div>

          {/* Content with max-width */}
          <div className="flex flex-col justify-center items-start gap-[35px] w-full max-w-[1008px]">
            <div className="flex flex-col justify-center items-center gap-[25px] w-[410px]">
              <div className="flex flex-col items-start gap-[10px] w-[410px]">
                {/* Next Payment Date */}
                <div className="flex flex-row items-center gap-[10px] w-[410px] h-[33px]">
                  <div className="flex flex-row items-center gap-[10px] w-[200px] h-[22px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333] w-[96px] h-[22px]">
                      次回の請求日
                    </span>
                  </div>
                  <div className="flex flex-row items-center py-[3px] px-0 gap-[10px] w-[200px] h-[33px]">
                    <span className="font-noto font-[400] text-[20px] leading-[27px] text-[#333333] w-[129px] h-[27px]">
                      {paymentInfo.nextPaymentDate}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex flex-row items-center gap-[10px] w-[410px] h-[33px]">
                  <div className="flex flex-row items-center gap-[10px] w-[200px] h-[22px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333] w-[64px] h-[22px]">
                      請求金額
                    </span>
                  </div>
                  <div className="flex flex-row items-center py-[3px] px-0 gap-[10px] w-[200px] h-[33px]">
                    <span className="font-noto font-[400] text-[20px] leading-[27px] text-[#333333] w-[175px] h-[27px]">
                      {paymentInfo.amount.toLocaleString()}円（税込）
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex flex-col justify-center items-start gap-[5px] w-[410px] h-[114px]">
                  <div className="flex flex-row items-center gap-[10px] w-[410px] h-[22px]">
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#333333] w-[80px] h-[22px]">
                      支払い方法
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-[10px] w-[410px] h-[43px]">
                    <Image
                      src="/assets/pictures/visa.png"
                      alt="Visa"
                      width={70}
                      height={43}
                      className="w-[70px] h-[43px]"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="font-noto font-[400] text-[16px] leading-[22px] text-[#808080] w-[155px] h-[22px]">
                      Visa **** **** {paymentInfo.paymentMethod.lastFourDigits}
                    </span>
                    <button
                      type="button"
                      className="flex flex-row items-center py-[10px] px-[15px] gap-[10px] w-[142px] h-[39px] bg-[#E1E1E1] rounded-[8px] border-none cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0]"
                    >
                      <span className="font-noto font-[400] text-[14px] leading-[19px] text-[#333333] w-[112px] h-[19px]">
                        支払い方法を追加
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Payment History */}
        <div className="flex flex-col items-start gap-[25px] w-full">
          {/* Full-width header with border */}
          <div className="flex flex-row items-center gap-[10px] w-full h-[27px]">
            <h2 className="font-noto font-[700] text-[20px] leading-[27px] text-[#333333]">
              お支払い履歴
            </h2>
          </div>

          {/* Content with max-width */}
          <div className="flex flex-col items-start w-full max-w-[1008px]">
            <div className="flex flex-col items-start w-full bg-white border border-[#D4D4D4] rounded-[4px]">
              {/* Table Header */}
              <div className="flex flex-row items-start w-full h-[50px]">
                <div className="flex flex-col justify-center items-start w-[130px] h-[50px] bg-[#F5F5F5] border-t border-l border-[#D4D4D4]">
                  <div className="flex flex-row justify-center items-center py-[15px] px-[12px] w-[130px] h-[48px]">
                    <span className="font-inter font-[600] text-[14px] leading-[130%] text-center text-[#333333] w-[96px] h-[18px]">
                      支払日
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start flex-1 h-[50px] bg-[#F5F5F5] border-t border-[#D4D4D4]">
                  <div className="flex flex-row items-start py-[15px] px-[12px] w-full h-[48px]">
                    <span className="font-inter font-[600] text-[14px] leading-[130%] text-center text-[#333333] flex-1">
                      請求金額(税込)
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start w-[120px] h-[50px] bg-[#F5F5F5] border-t border-[#D4D4D4]">
                  <div className="flex flex-row items-start py-[15px] px-[12px] w-[120px] h-[48px]">
                    <span className="font-inter font-[600] text-[14px] leading-[130%] text-center text-[#333333] w-[96px] h-[18px]">
                      利用年月
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start flex-1 h-[50px] bg-[#F5F5F5] border-t border-[#D4D4D4]">
                  <div className="flex flex-row items-start py-[15px] px-[12px] w-full h-[48px]">
                    <span className="font-inter font-[600] text-[14px] leading-[130%] text-center text-[#333333] flex-1">
                      ステータス
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start flex-1 h-[50px] bg-[#F5F5F5] border-t border-[#D4D4D4]">
                  <div className="flex flex-row items-start py-[15px] px-[12px] w-full h-[48px]">
                    <span className="font-inter font-[600] text-[14px] leading-[130%] text-center text-[#333333] flex-1">
                      請求書
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex flex-row justify-center items-center w-full h-[48px]">
                  <div className="flex flex-col justify-center items-center w-[130px] h-[48px] bg-white/[0.002] border-t border-l border-[#D4D4D4]">
                    <div className="flex flex-row items-start py-[15px] px-[12px] w-[99px] h-[48px]">
                      <span className="font-noto-jp font-[500] text-[14px] leading-[130%] text-right text-[#333333] w-[75px] h-[18px]">
                        {payment.paymentDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center flex-1 h-[48px] bg-white/[0.002] border-t border-[#D4D4D4]">
                    <div className="flex flex-row justify-center items-center py-[15px] px-[12px] w-full h-[48px]">
                      <span className="font-noto-jp font-[500] text-[14px] leading-[130%] text-center text-[#333333] flex-1">
                        {payment.amount.toLocaleString()}円
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-start w-[120px] h-[48px] bg-white/[0.002] border-t border-[#D4D4D4]">
                    <div className="flex flex-row justify-center items-center py-[15px] px-[12px] w-[120px] h-[48px]">
                      <span className="font-noto-jp font-[500] text-[14px] leading-[130%] text-center text-[#333333] w-[112px] h-[18px]">
                        {payment.billingPeriod}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-start flex-1 h-[48px] bg-white/[0.002] border-t border-[#D4D4D4]">
                    <div className="flex flex-row justify-center items-center py-[15px] px-[12px] w-full h-[46px]">
                      <span className="font-noto-jp font-[500] text-[12px] leading-[130%] text-center text-[#333333] flex-1">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-start flex-1 h-[48px] bg-white/[0.002] border-t border-[#D4D4D4]">
                    <div className="flex flex-row justify-center items-center py-[15px] px-[12px] w-full h-[46px]">
                      <button
                        type="button"
                        className="font-noto-jp font-[500] text-[12px] leading-[130%] text-center text-[#066A9E] bg-transparent border-none cursor-pointer flex-1"
                        onClick={() => handleDownloadInvoice(payment.invoiceUrl)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email Change Modal */}
        <EmailChangeModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSend={handleEmailSent}
        />

        {/* Email Success Modal */}
        <InfoModal
          isOpen={showEmailSuccessModal}
          onClose={() => setShowEmailSuccessModal(false)}
          title="メールアドレスを変更"
          message={"ご入力いただいたメールアドレスへ再設定用URLを送信しました。\nメール内のURLをクリックすると、\nメールアドレス変更が完了いたします。"}
        />

        {/* Avatar Change Modal */}
        <AvatarChangeModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          onSave={handleAvatarColorChange}
          currentColor={userProfile.avatarColor}
        />
      </div>
    </PageTransition>
  );
}
