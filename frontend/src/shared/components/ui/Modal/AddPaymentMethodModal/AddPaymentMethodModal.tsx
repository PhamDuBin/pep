"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Modal } from "../Modal";
import type { AddPaymentModalState } from "@/shared/types";
import type { PaymentFormData } from "@/shared/models";

export interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPaymentMethod: (data: PaymentFormData) => void;
  isSaving?: boolean;
  modalState?: AddPaymentModalState;
}

export function AddPaymentMethodModal({
  isOpen,
  onClose,
  onAddPaymentMethod,
  isSaving = false,
  modalState = "form",
}: AddPaymentMethodModalProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    cardholderName: "",
    postalCode: "",
    prefecture: "",
    city: "",
    streetAddress: "",
    buildingName: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && modalState === "form") {
      setFormData({
        cardNumber: "",
        expiryDate: "",
        securityCode: "",
        cardholderName: "",
        postalCode: "",
        prefecture: "",
        city: "",
        streetAddress: "",
        buildingName: "",
      });
    }
  }, [isOpen, modalState]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleClose = useCallback(() => {
    setFormData({
      cardNumber: "",
      expiryDate: "",
      securityCode: "",
      cardholderName: "",
      postalCode: "",
      prefecture: "",
      city: "",
      streetAddress: "",
      buildingName: "",
    });
    onClose();
  }, [onClose]);

  const handleAdd = useCallback(() => {
    // Basic validation
    if (
      formData.cardNumber &&
      formData.expiryDate &&
      formData.securityCode &&
      formData.cardholderName &&
      formData.postalCode &&
      formData.prefecture &&
      formData.city &&
      formData.streetAddress
    ) {
      onAddPaymentMethod(formData);
    }
  }, [formData, onAddPaymentMethod]);

  const isValid = useMemo(
    () =>
      formData.cardNumber.trim() !== "" &&
      formData.expiryDate.trim() !== "" &&
      formData.securityCode.trim() !== "" &&
      formData.cardholderName.trim() !== "" &&
      formData.postalCode.trim() !== "" &&
      formData.prefecture.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.streetAddress.trim() !== "",
    [formData]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="クレジットカードを追加"
      size="md"
      customClass="p-[20px_35px] gap-[25px] w-[500px] max-w-[500px] [&_.modal-title]:text-[20px] [&_.modal-title]:text-[#066A9E] [&_.modal-title]:text-center [&_.modal-body]:px-0 [&_.modal-body]:gap-[15px] [&_.modal-actions]:flex [&_.modal-actions]:flex-row [&_.modal-actions]:gap-[10px] [&_.modal-actions]:justify-center [&_.modal-actions]:items-center"
      isLoading={isSaving}
      actions={
        modalState === "form" ? (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="flex items-center justify-center py-[10px] px-[15px] bg-[#E1E1E1] border-none rounded-[8px] font-normal text-[14px] text-[#333333] cursor-pointer transition-colors duration-200 min-w-[100px] hover:bg-[#d1d1d1]"
              onClick={handleClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-[10px] px-[15px] bg-[#333333] border-none rounded-[8px] font-normal text-[14px] text-white cursor-pointer transition-colors duration-200 min-w-[142px] hover:enabled:bg-[#222222] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!isValid || isSaving}
              onClick={handleAdd}
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "支払い方法を追加"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-[10px] justify-center items-center">
            <button
              type="button"
              className="flex items-center justify-center py-[10px] px-[15px] bg-[#E1E1E1] border-none rounded-[8px] font-normal text-[14px] text-[#333333] cursor-pointer transition-colors duration-200 min-w-[72px] hover:bg-[#d1d1d1]"
              onClick={handleClose}
            >
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "form" ? (
        // Form State
        <div className="flex flex-col gap-[15px] w-full">
          {/* Card Number Field */}
          <div className="flex flex-col gap-[10px]">
            <label className="font-normal text-[16px] text-[#333333]">
              カード番号
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="カード番号"
              className="w-full h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
            />
          </div>

          {/* Expiry Date and Security Code Row */}
          <div className="flex flex-row gap-[15px]">
            {/* Expiry Date */}
            <div className="flex flex-col gap-[10px] flex-1">
              <label className="font-normal text-[16px] text-[#333333]">
                有効期限
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="月(MM)/年(YY)"
                className="w-full h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
              />
            </div>

            {/* Security Code */}
            <div className="flex flex-col gap-[10px] flex-1">
              <label className="font-normal text-[16px] text-[#333333]">
                セキュリティコード
              </label>
              <input
                type="text"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleInputChange}
                placeholder="CVC / CVV（3-4桁）"
                className="w-full h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="flex flex-col gap-[10px]">
            <label className="font-normal text-[16px] text-[#333333]">
              カードの名義人
            </label>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="カードの名義人"
              className="w-full h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
            />
          </div>

          {/* Billing Address Section */}
          <div className="flex flex-col gap-[10px]">
            <label className="font-normal text-[16px] text-[#333333]">
              請求先住所
            </label>

            {/* Postal Code and Prefecture Row */}
            <div className="flex flex-row gap-[10px]">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="郵便番号"
                className="flex-1 h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
              />
              <input
                type="text"
                name="prefecture"
                value={formData.prefecture}
                onChange={handleInputChange}
                placeholder="都道府県"
                className="flex-1 h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
              />
            </div>

            {/* City */}
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="市区町村"
              className="w-full h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
            />

            {/* Street Address */}
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="町名・番地"
              className="w-full h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
            />

            {/* Building Name */}
            <input
              type="text"
              name="buildingName"
              value={formData.buildingName}
              onChange={handleInputChange}
              placeholder="建物名・部屋番号"
              className="w-full h-[42px] px-[10px] py-[10px] border-[1px] border-[#B9B9B9] rounded-[4px] font-normal text-[16px] text-[#333333] placeholder-[#B9B9B9] focus:outline-none focus:border-[#066A9E]"
            />
          </div>
        </div>
      ) : (
        // Success State
        <div className="flex flex-col gap-[10px] items-center justify-center w-full">
          <p className="font-noto-jp font-medium text-[14px] leading-[130%] text-center text-[#333333]">
            支払い方法を追加しました。
          </p>
        </div>
      )}
    </Modal>
  );
}

