"use client";

import { useState } from "react";
import { INDUSTRIES, EMPLOYEE_COUNTS } from "../constants";
import { useAccountForm } from "../hooks";
import Image from "next/image";

export function AccountRegistrationForm({ email = "example@email.com" }) {
  const { formData, setFormData, errors, handleSubmit, handleTextareaChange } =
    useAccountForm();
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isEmployeeCountOpen, setIsEmployeeCountOpen] = useState(false);

  return (
    <div className="w-full min-h-[calc(100vh-89px)] flex flex-col items-center pt-[50px] bg-white">
      <div className="w-full flex flex-col gap-[50px] items-center">
        {/* Title / タイトル */}
        <div className="flex items-center justify-center">
          <h1 className="font-noto-jp font-bold text-[32px] leading-normal text-[#333] m-0 border-b border-[#cfcfcf] pb-[25px]">
            アカウント情報登録
          </h1>
        </div>

        {/* Form / フォーム */}
        <form
          onSubmit={handleSubmit}
          className="w-[750px] flex flex-col gap-[50px] items-center"
        >
          {/* Organization Info Section / 組織情報セクション */}
          <div className="flex flex-col gap-[20px] w-full">
            <div className="flex items-center w-full">
              <h2 className="font-noto-jp font-semibold text-[20px] leading-normal text-[#333] m-0">
                組織情報
              </h2>
            </div>

            <div className="flex flex-col gap-[12px]">
              {/* Company Name / 会社名 */}
              <div className="flex gap-[10px] items-start w-full">
                <div className="w-[250px] flex gap-[3px] items-center text-[16px] leading-normal">
                  <span className="font-noto-jp font-normal text-[#333]">
                    会社名
                  </span>
                  <span className="font-noto-jp font-bold text-[#066a9e]">
                    *
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-[3px] min-h-[46px] justify-center">
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="株式会社サンプル"
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                  />
                  {errors.companyName && (
                    <span className="font-noto-jp text-[12px] leading-normal text-[#c10000]">
                      {errors.companyName}
                    </span>
                  )}
                </div>
              </div>

              {/* Industry / 業種 */}
              <div className="flex gap-[10px] items-start w-full">
                <div className="w-[250px] flex gap-[3px] items-center text-[16px] leading-normal h-[46px]">
                  <span className="font-noto-jp font-normal text-[#333]">
                    業種
                  </span>
                  <span className="font-noto-jp font-bold text-[#066a9e]">
                    *
                  </span>
                </div>
                <div className="w-[300px] flex flex-col gap-[3px] relative">
                  <div
                    onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                    className="bg-[#f5f7fa] rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp flex justify-between items-center cursor-pointer select-none"
                    style={{ color: formData.industry ? "#333" : "#b9b9b9" }}
                  >
                    <span>{formData.industry || "選択してください"}</span>
                    <Image
                      src="/assets/icons/chevron-down-blue.svg"
                      width={12}
                      height={6}
                      alt="Arrow Down"
                      className={`transition-transform duration-200 flex-shrink-0 ${
                        isIndustryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {isIndustryOpen && (
                    <div className="absolute w-[300px] top-full left-0 right-0 bg-white border border-[#cfcfcf] rounded max-h-[300px] overflow-y-auto z-10 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)] mt-[2px]">
                      <div className="px-[10px] py-[7px] cursor-default font-noto-jp text-[14px] leading-normal text-[#b9b9b9]">
                        選択してください
                      </div>
                      {INDUSTRIES.map((industry) => (
                        <div
                          key={industry}
                          onClick={() => {
                            setFormData({ ...formData, industry });
                            setIsIndustryOpen(false);
                          }}
                          className={`px-[10px] py-[7px] cursor-pointer font-noto-jp text-[14px] leading-normal text-[#333] hover:bg-[#f5f8fa] ${
                            formData.industry === industry
                              ? "bg-[#f5f8fa]"
                              : "bg-white"
                          }`}
                        >
                          {industry}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.industry && (
                    <span className="font-noto-jp text-[12px] leading-normal text-[#c10000]">
                      {errors.industry}
                    </span>
                  )}
                </div>
              </div>

              {/* Employee Count / 従業員数 */}
              <div className="flex gap-[10px] items-start w-full">
                <div className="w-[250px] flex gap-[3px] items-center text-[16px] leading-normal h-[46px]">
                  <span className="font-noto-jp font-normal text-[#333]">
                    従業員数
                  </span>
                  <span className="font-noto-jp font-bold text-[#066a9e]">
                    *
                  </span>
                </div>
                <div className="w-[300px] flex flex-col gap-[3px] relative">
                  <div
                    onClick={() => setIsEmployeeCountOpen(!isEmployeeCountOpen)}
                    className="bg-[#f5f7fa] rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp flex justify-between items-center cursor-pointer select-none"
                    style={{
                      color: formData.employeeCount ? "#333" : "#b9b9b9",
                    }}
                  >
                    <span>{formData.employeeCount || "選択してください"}</span>
                    <Image
                      src="/assets/icons/chevron-down-blue.svg"
                      width={12}
                      height={6}
                      alt="Arrow Down"
                      className={`transition-transform duration-200 flex-shrink-0 ${
                        isEmployeeCountOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {isEmployeeCountOpen && (
                    <div className="absolute w-[300px] top-full left-0 right-0 bg-white border border-[#cfcfcf] rounded overflow-y-auto z-10 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.1)] mt-[2px]">
                      <div className="px-[10px] py-[7px] cursor-default font-noto-jp text-[14px] leading-normal text-[#b9b9b9]">
                        選択してください
                      </div>
                      {EMPLOYEE_COUNTS.map((count) => (
                        <div
                          key={count}
                          onClick={() => {
                            setFormData({ ...formData, employeeCount: count });
                            setIsEmployeeCountOpen(false);
                          }}
                          className={`px-[10px] py-[7px] cursor-pointer font-noto-jp text-[14px] leading-normal text-[#333] hover:bg-[#f5f8fa] ${
                            formData.employeeCount === count
                              ? "bg-[#f5f8fa]"
                              : "bg-white"
                          }`}
                        >
                          {count}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.employeeCount && (
                    <span className="font-noto-jp text-[12px] leading-normal text-[#c10000]">
                      {errors.employeeCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Business Description / 事業内容 */}
              <div className="flex gap-[10px] items-start w-full">
                <div className="w-[250px] flex flex-col gap-[3px] text-[16px] leading-normal">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-noto-jp font-normal text-[#333]">
                      事業内容
                    </span>
                    <span className="font-noto-jp font-bold text-[#066a9e]">
                      *
                    </span>
                  </div>
                  <span className="font-noto-jp text-[14px] leading-normal text-[#333]">
                    (10〜100文字以内)
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-[3px]">
                  <textarea
                    value={formData.businessDescription}
                    onChange={(e) =>
                      handleTextareaChange(e, "businessDescription")
                    }
                    placeholder="クラウドサービスの開発・提供"
                    rows={3}
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none resize-y"
                  />
                  {errors.businessDescription && (
                    <span className="font-noto-jp text-[12px] leading-normal text-[#c10000]">
                      {errors.businessDescription}
                    </span>
                  )}
                </div>
              </div>

              {/* Service Description / サービス説明 */}
              <div className="flex gap-[10px] items-start w-full">
                <div className="w-[250px] flex flex-col gap-[3px] text-[16px] leading-normal">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-noto-jp font-normal text-[#333]">
                      サービス説明
                    </span>
                    <span className="font-noto-jp font-bold text-[#066a9e]">
                      *
                    </span>
                  </div>
                  <span className="font-noto-jp text-[14px] leading-normal text-[#333]">
                    (10〜100文字以内)
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-[3px]">
                  <textarea
                    value={formData.serviceDescription}
                    onChange={(e) =>
                      handleTextareaChange(e, "serviceDescription")
                    }
                    placeholder="SaaS型業務管理システム"
                    rows={3}
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none resize-y"
                  />
                  {errors.serviceDescription && (
                    <span className="font-noto-jp text-[12px] leading-normal text-[#c10000]">
                      {errors.serviceDescription}
                    </span>
                  )}
                </div>
              </div>

              {/* Corporate Site URL / コーポレートサイトURL */}
              <div className="flex gap-[10px] items-start w-full">
                <div className="w-[250px] flex gap-[3px] items-center text-[16px] leading-normal">
                  <span className="font-noto-jp font-normal text-[#333]">
                    コーポレートサイトURL
                  </span>
                  <span className="font-noto-jp font-bold text-[#066a9e]">
                    *
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-[3px] min-h-[46px] justify-center">
                  <input
                    type="url"
                    value={formData.corporateUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, corporateUrl: e.target.value })
                    }
                    placeholder="https://example.co.jp"
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                  />
                  {errors.corporateUrl && (
                    <span className="font-noto-jp text-[12px] leading-normal text-[#c10000]">
                      {errors.corporateUrl}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Info Section / 個人情報セクション */}
          <div className="flex flex-col gap-[20px] w-full">
            <div className="flex items-center w-full">
              <h2 className="font-noto-jp font-semibold text-[20px] leading-normal text-[#333] m-0">
                個人情報
              </h2>
            </div>

            <div className="flex flex-col gap-[12px]">
              {/* Name / 氏名 */}
              <div className="flex gap-[10px] items-start w-full">
                <div className="w-[250px] flex gap-[3px] items-center text-[16px] leading-normal">
                  <span className="font-noto-jp font-normal text-[#333]">
                    氏名
                  </span>
                  <span className="font-noto-jp font-bold text-[#066a9e]">
                    *
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-[3px] min-h-[46px] justify-center">
                  <div className="flex gap-[4px] w-full">
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="山田"
                      className="flex-1 bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                    />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="太郎"
                      className="flex-1 bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                    />
                  </div>
                  {(errors.lastName || errors.firstName) && (
                    <span className="font-noto-jp text-[12px] leading-normal text-[#c10000]">
                      氏名は必須項目です
                    </span>
                  )}
                </div>
              </div>

              {/* Name (Furigana) / 氏名（フリガナ） */}
              <div className="flex gap-[10px] items-start w-full">
                <div className="w-[250px] flex gap-[3px] items-center text-[16px] leading-normal">
                  <span className="font-noto-jp font-normal text-[#333]">
                    氏名（フリガナ）
                  </span>
                  <span className="font-noto-jp font-bold text-[#066a9e]">
                    *
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-[3px] min-h-[46px] justify-center">
                  <div className="flex gap-[4px] w-full">
                    <input
                      type="text"
                      value={formData.lastNameKana}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastNameKana: e.target.value,
                        })
                      }
                      placeholder="ヤマダ"
                      className="flex-1 bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                    />
                    <input
                      type="text"
                      value={formData.firstNameKana}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstNameKana: e.target.value,
                        })
                      }
                      placeholder="タロウ"
                      className="flex-1 bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                    />
                  </div>
                  {(errors.lastNameKana || errors.firstNameKana) && (
                    <span className="font-noto-jp text-[12px] leading-normal text-[#c10000]">
                      氏名（フリガナ）は必須項目です
                    </span>
                  )}
                </div>
              </div>

              {/* Email Address / メールアドレス */}
              <div className="flex gap-[10px] items-center w-full">
                <div className="w-[250px] flex items-center text-[16px] leading-normal">
                  <span className="font-noto-jp font-normal text-[#333]">
                    メールアドレス
                  </span>
                </div>
                <div className="flex-1 flex items-center p-[10px] rounded">
                  <span className="font-noto-jp text-[16px] leading-normal text-[#333]">
                    {email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button / 送信ボタン */}
          <div className="flex items-center">
            <button
              type="submit"
              className="!bg-blue-700 modal-btn-primary-color "
            >
              次へ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
