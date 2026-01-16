"use client";

import Image from "next/image";
import { EmailChangeModal, AvatarChangeModal, Loading, PageTransition } from "@/shared/components";
import { InfoModal } from "@/features/vendor/shared/components";
import { useVendorMyPage } from "./hooks";

export function VendorMyPage() {
  const {
    isLoading,
    isSaving,
    userProfile,
    paymentInfo,
    paymentHistory,
    newPassword,
    confirmPassword,
    showNewPassword,
    showConfirmPassword,
    showPasswordSaveSuccess,
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

  return (
    <PageTransition>
      <div className="flex flex-col gap-[25px] w-full px-[50px] py-[25px]">
        {isLoading || !userProfile ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loading type="spinner" size="lg" />
          </div>
        ) : (
          <div className="flex flex-col gap-[35px]">
            {/* User Info Section */}
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
                    style={{ backgroundColor: userProfile.avatarColor || "#8ec5d0" }}
                    onClick={handleAvatarUpload}
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
                      <span className="font-normal text-[24px] text-white">
                        {userProfile.initials}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="flex items-center px-[15px] py-[10px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333] cursor-pointer transition-colors duration-200 hover:bg-[#d1d1d1]"
                    onClick={handleAvatarUpload}
                  >
                    画像を選択
                  </button>
                </div>

                {/* Success Message */}
                {showPasswordSaveSuccess && (
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
                        {userProfile.name}
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
                        {userProfile.email}
                      </span>
                      <button
                        type="button"
                        className="bg-transparent border-none font-normal text-[16px] text-[#066a9e] underline cursor-pointer p-0 hover:opacity-80"
                        onClick={handleEmailChange}
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
                        type={showNewPassword ? "text" : "password"}
                        className="flex-1 border-none outline-none font-normal text-[16px] text-black bg-transparent placeholder:text-[#808080]"
                        placeholder="8〜16文字の英数字で入力"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer shrink-0 hover:opacity-70"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                            <path d="m2 2 20 20" />
                          </svg>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                            <path d="m2 2 20 20" />
                          </svg>
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
                    onClick={handleSaveChanges}
                  >
                    {isSaving ? "保存中..." : "変更を保存"}
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Info Section */}
            {paymentInfo && (
              <>
                <div className="flex flex-col gap-[25px] w-full">
                  <div className="flex items-center pb-[10px] border-b border-[#cfcfcf]">
                    <h2 className="font-bold text-[20px] leading-normal text-[#333] m-0">
                      決済情報
                    </h2>
                  </div>
                  <div className="flex flex-col items-start justify-center w-full">
                    <div className="flex flex-col gap-[10px] items-start">
                      {/* Next Billing Date */}
                      <div className="flex items-center gap-[10px]">
                        <span className="w-[200px] font-normal text-[16px] text-black">
                          次回の請求日
                        </span>
                        <span className="font-normal text-[20px] text-black py-[3px]">
                          {paymentInfo.nextPaymentDate}
                        </span>
                      </div>

                      {/* Billing Amount */}
                      <div className="flex items-center gap-[10px]">
                        <span className="w-[200px] font-normal text-[16px] text-black">
                          請求金額
                        </span>
                        <span className="font-normal text-[20px] text-black py-[3px]">
                          {paymentInfo.amount.toLocaleString()}円（税込）
                        </span>
                      </div>

                      {/* Payment Method */}
                      <div className="flex flex-col gap-[5px] items-start justify-center w-full">
                        <span className="w-[200px] font-normal text-[16px] text-black">
                          支払い方法
                        </span>

                        {paymentInfo.paymentMethod && (
                          <div className="flex items-center gap-[10px] w-full">
                            <Image
                              src="/assets/pictures/visa.png"
                              alt="Visa"
                              width={70}
                              height={43}
                              className="object-cover"
                            />
                            <span className="font-normal text-[16px] text-[#808080]">
                              Visa **** **** {paymentInfo.paymentMethod.lastFourDigits}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          className="flex items-center px-[15px] py-[10px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333] cursor-pointer transition-colors duration-200 hover:bg-[#d1d1d1]"
                        >
                          支払い方法を追加
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment History Section */}
                {paymentHistory.length > 0 && (
                  <div className="flex flex-col gap-[25px] items-center justify-center w-full">
                    <div className="flex items-center pb-[10px] border-b border-[#cfcfcf] w-full">
                      <h2 className="font-bold text-[20px] leading-normal text-[#333] m-0">
                        お支払い履歴
                      </h2>
                    </div>
                    <div className="w-full overflow-x-auto border border-[#d4d4d4]">
                      <table className="w-full border-collapse bg-white border border-[#d4d4d4] rounded-[4px] overflow-hidden">
                        <thead>
                          <tr className="bg-[#f5f5f5]">
                            <th className="w-[130px] border-l border-t border-[#d4d4d4] font-semibold text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                              支払日
                            </th>
                            <th className="flex-1 border-t border-[#d4d4d4] font-semibold text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                              請求金額(税込)
                            </th>
                            <th className="w-[179px] border-t border-[#d4d4d4] font-semibold text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                              利用年月
                            </th>
                            <th className="flex-1 border-t border-[#d4d4d4] font-semibold text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                              ステータス
                            </th>
                            <th className="flex-1 border-t border-[#d4d4d4] font-semibold text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                              請求書
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((record) => (
                            <tr key={record.id}>
                              <td className="w-[130px] border-l border-t border-[#d4d4d4] font-medium text-[14px] text-black text-center px-[12px] py-[15px]">
                                {record.paymentDate}
                              </td>
                              <td className="flex-1 border-t border-[#d4d4d4] font-medium text-[14px] text-black text-center px-[12px] py-[15px]">
                                {record.amount.toLocaleString()}円
                              </td>
                              <td className="w-[179px] border-t border-[#d4d4d4] font-medium text-[14px] text-black text-center px-[12px] py-[15px]">
                                {record.billingPeriod}
                              </td>
                              <td className="flex-1 border-t border-[#d4d4d4] font-medium text-[12px] text-black text-center px-[12px] py-[15px]">
                                {record.status}
                              </td>
                              <td className="flex-1 border-t border-[#d4d4d4] font-medium text-[14px] text-black text-center px-[12px] py-[15px]">
                                <button
                                  type="button"
                                  className="bg-transparent border-none font-medium text-[12px] text-[#066a9e] cursor-pointer p-0 hover:underline"
                                  onClick={() => handleDownloadInvoice(record.invoiceUrl)}
                                >
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

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
          currentColor={userProfile?.avatarColor || "#8ec5d0"}
        />
      </div>
    </PageTransition>
  );
}
