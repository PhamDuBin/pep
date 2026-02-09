"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PaymentsFormData } from "@/shared/models/auth.model";

interface PaymentRegistrationFormProps {
  onSubmit?: (data: PaymentsFormData) => void;
  onSkip?: () => void;
}

export function PaymentRegistrationForm({
  onSubmit,
  onSkip,
}: PaymentRegistrationFormProps) {
  const [formData, setFormData] = useState<PaymentsFormData>({
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
    cardholderName: "",
    country: "日本",
    postalCode: "",
    prefecture: "",
    city: "",
    streetAddress: "",
    buildingName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="w-full min-h-[calc(100vh-89px)] flex flex-col items-center pt-[50px] bg-white">
      <div className="w-full flex flex-col gap-[71px] items-center">
        {/* Title / タイトル */}
        <div className="flex items-center justify-center">
          <h1 className="font-noto-jp font-bold text-[32px] leading-normal text-[#333] m-0 border-b border-[#cfcfcf] pb-[25px]">
            プランを開始する
          </h1>
        </div>

        {/* Form Content / フォーム内容 */}
        <form
          onSubmit={handleSubmit}
          className="w-[500px] flex flex-col gap-[50px] items-center"
        >
          {/* Plan Info / プラン情報 */}
          <div className="flex flex-col gap-[5px] items-start justify-center w-full">
            <div className="flex items-center w-full">
              <p className="font-noto-jp font-semibold text-[18px] leading-normal text-[#808080]">
                ベンダーProプラン
              </p>
            </div>
            <div className="flex font-noto-jp font-semibold items-end">
              <p className="text-[#333] text-[24px] leading-normal">
                年額￥600,000(税別)
              </p>
              <p className="text-[#808080] text-[16px] leading-normal">/組織</p>
            </div>
          </div>

          {/* Payment Method Section / 支払い方法セクション */}
          <div className="flex flex-col gap-[20px] items-start w-full">
            <div className="flex items-center w-full">
              <h2 className="font-noto-jp font-semibold text-[20px] leading-normal text-[#333] m-0">
                支払い方法
              </h2>
            </div>

            <div className="flex flex-col gap-[13px] items-start w-full">
              {/* Card Number / カード番号 */}
              <div className="flex flex-col gap-[5px] items-start justify-center w-full">
                <div className="flex gap-[3px] items-center">
                  <span className="font-noto-jp font-normal text-[16px] leading-normal text-[#333]">
                    カード番号
                  </span>
                </div>
                <div className="flex flex-col gap-[3px] h-[46px] items-start justify-center w-full">
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: e.target.value })
                    }
                    placeholder="1234 1234 1234 1234"
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                  />
                </div>
              </div>

              {/* Expiration Date & Security Code / 有効期限とセキュリティコード */}
              <div className="flex gap-[13px] items-start w-full">
                <div className="flex-1 flex flex-col gap-[5px] items-start justify-center">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-noto-jp font-normal text-[16px] leading-normal text-[#333]">
                      有効期限
                    </span>
                  </div>
                  <div className="flex flex-col gap-[3px] h-[46px] items-start justify-center w-full">
                    <input
                      type="text"
                      value={formData.expirationDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expirationDate: e.target.value,
                        })
                      }
                      placeholder="月(MM) / 年(YY)"
                      className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-[5px] items-start justify-center">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-noto-jp font-normal text-[16px] leading-normal text-[#333]">
                      セキュリティコード
                    </span>
                  </div>
                  <div className="flex flex-col gap-[3px] h-[46px] items-start justify-center w-full">
                    <input
                      type="text"
                      value={formData.securityCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          securityCode: e.target.value,
                        })
                      }
                      placeholder="CVC"
                      className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Cardholder Name / カード名義 */}
              <div className="flex flex-col gap-[5px] items-start justify-center w-full">
                <div className="flex gap-[3px] items-center">
                  <span className="font-noto-jp font-normal text-[16px] leading-normal text-[#333]">
                    カード名義（ローマ字）
                  </span>
                </div>
                <div className="flex flex-col gap-[3px] h-[46px] items-start justify-center w-full">
                  <input
                    type="text"
                    value={formData.cardholderName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardholderName: e.target.value,
                      })
                    }
                    placeholder="TARO YAMADA"
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                  />
                </div>
              </div>

              {/* Country & Postal Code / 国と郵便番号 */}
              <div className="flex gap-[13px] items-start w-full">
                <div className="flex-1 flex flex-col gap-[5px] items-start justify-center">
                  <div className="flex items-center w-full">
                    <span className="font-noto-jp font-normal text-[16px] leading-normal text-[#333]">
                      国
                    </span>
                  </div>
                  <div className="flex gap-[10px] items-center w-full">
                    <div className="bg-[#f5f8fa] flex flex-1 items-center justify-between px-[10px] py-[12px] rounded cursor-pointer">
                      <span className="font-noto-jp font-normal text-[16px] leading-normal text-[#333]">
                        {formData.country}
                      </span>
                      <Image
                        src="/assets/icons/chevron-down-blue.svg"
                        width={12}
                        height={6}
                        alt="Arrow Down"
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-[5px] items-start justify-center">
                  <div className="flex gap-[3px] items-center">
                    <span className="font-noto-jp font-normal text-[16px] leading-normal text-[#333]">
                      郵便番号
                    </span>
                  </div>
                  <div className="flex flex-col gap-[3px] h-[46px] items-start justify-center w-full">
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                      placeholder="1234567"
                      className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address / 請求先住所 */}
              <div className="flex flex-col gap-[10px] items-start w-full">
                <div className="flex gap-[3px] items-center">
                  <span className="font-noto-jp font-normal text-[16px] leading-normal text-[#333]">
                    請求先住所
                  </span>
                </div>
                <div className="flex flex-col gap-[10px] items-start justify-center w-full">
                  {/* Prefecture / 都道府県 */}
                  <div className="flex items-start w-full">
                    <input
                      type="text"
                      value={formData.prefecture}
                      onChange={(e) =>
                        setFormData({ ...formData, prefecture: e.target.value })
                      }
                      placeholder="都道府県"
                      className="flex-1 bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                    />
                  </div>

                  {/* City / 市区町村 */}
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="市区町村"
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                  />

                  {/* Street Address / 町名・番地 */}
                  <input
                    type="text"
                    value={formData.streetAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        streetAddress: e.target.value,
                      })
                    }
                    placeholder="町名・番地"
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                  />

                  {/* Building Name / 建物名・部屋番号 */}
                  <input
                    type="text"
                    value={formData.buildingName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        buildingName: e.target.value,
                      })
                    }
                    placeholder="建物名・部屋番号"
                    className="w-full bg-[#f5f7fa] border-none rounded px-[10px] py-[12px] text-[16px] leading-normal font-noto-jp text-[#333] placeholder:text-[#b9b9b9] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section / 下部セクション */}
          <div className="flex flex-col gap-[50px] items-center">
            <div className="flex flex-col gap-[5px] items-center">
              <p className="font-noto-jp font-normal text-[14px] leading-normal text-[#333] text-center">
                ※ 毎年自動更新
              </p>
              <p className="font-noto-jp font-semibold text-[20px] leading-normal text-[#333] text-center">
                年額￥600,000(税別)
              </p>
              <button
                type="submit"
                className="bg-[#066a9e] modal-btn-primary-color"
              >
                利用を開始する
              </button>
            </div>

            <button
              type="button"
              onClick={onSkip}
              className="font-noto-jp font-bold text-[16px] leading-normal text-[#066a9e] bg-transparent border-none cursor-pointer hover:underline"
            >
              スキップして始める
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
