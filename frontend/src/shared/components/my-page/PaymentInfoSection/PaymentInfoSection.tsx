"use client";

import { Pagination } from "@/shared/components";
import { PaymentInfo, PaymentHistoryRecord } from "@/features/buyer/my-page/models";

interface PaymentInfoSectionProps {
  paymentInfo: PaymentInfo;
  paymentHistory: PaymentHistoryRecord[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  handleDownloadInvoice: (id: string) => void;
  handleAddPaymentMethod: () => void;
  formatAmount: (amount: number, taxIncluded?: boolean) => string;
  getPaymentMethodDisplay: () => string;
  getStatusLabel: (status: string) => React.ReactNode;
}

export function PaymentInfoSection({
  paymentInfo,
  paymentHistory,
  currentPage,
  totalPages,
  handlePageChange,
  handleDownloadInvoice,
  handleAddPaymentMethod,
  formatAmount,
  getPaymentMethodDisplay,
  getStatusLabel,
}: PaymentInfoSectionProps) {
  return (
    <>
      {/* Payment Info Section */}
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
                {paymentInfo.nextBillingDate}
                {paymentInfo.nextBillingDate}
              </span>
            </div>

            {/* Billing Amount */}
            <div className="flex items-center gap-[10px]">
              <span className="w-[200px] font-normal text-[16px] text-black">
                請求金額
              </span>
              <span className="font-normal text-[20px] text-black py-[3px]">
                {formatAmount(
                  paymentInfo.billingAmount,
                  paymentInfo.taxIncluded
                )}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-[5px] items-start justify-center w-full">
              <span className="w-[200px] font-normal text-[16px] text-black">
                支払い方法
              </span>

              {paymentInfo.paymentMethod && (
                <div className="flex items-center gap-[10px] w-full">
                  <img
                    src="/assets/pictures/visa.png"
                    alt="Visa"
                    className="object-cover"
                    width={70}
                    height={43}
                  />
                  <span className="font-normal text-[16px] text-[#808080]">
                    {getPaymentMethodDisplay()}
                  </span>
                </div>
              )}

              <button
                type="button"
                className="flex items-center px-[15px] py-[10px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333] cursor-pointer transition-colors duration-200 hover:bg-[#d1d1d1]"
                onClick={handleAddPaymentMethod}
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
          <div className="w-full overflow-x-auto border border-[#d4d4d4] rounded-[8px]">
            <table className="w-full border-collapse bg-white border border-[#d4d4d4] rounded-[4px] overflow-hidden">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="w-[130px] border-l border-t border-[#d4d4d4] font-[600] font-[Inter] text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                    支払日
                  </th>
                  <th className="flex-1 border-t border-[#d4d4d4] font-[600] font-[Inter] text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                    請求金額(税込)
                  </th>
                  <th className="w-[179px] border-t border-[#d4d4d4] font-[600] font-[Inter] text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                    利用年月
                  </th>
                  <th className="flex-1 border-t border-[#d4d4d4] font-[600] font-[Inter] text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                    ステータス
                  </th>
                  <th className="flex-1 border-t border-[#d4d4d4] font-[600] font-[Inter] text-[14px] text-black text-center px-[12px] py-[15px] whitespace-nowrap">
                    請求書
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="w-[130px] border-l border-t border-[#d4d4d4] font-[500] font-['Noto_Sans_JP'] text-[14px] text-black text-center px-[12px] py-[15px]">
                      {record.paymentDate}
                    </td>
                    <td className="flex-1 border-t border-[#d4d4d4] font-[500] font-['Noto_Sans_JP'] text-[14px] text-black text-center px-[12px] py-[15px]">
                      {formatAmount(record.amount)}
                    </td>
                    <td className="w-[179px] border-t border-[#d4d4d4] font-[500] font-['Noto_Sans_JP'] text-[14px] text-black text-center px-[12px] py-[15px]">
                      {record.usagePeriod}
                      {record.usagePeriod}
                    </td>
                    <td className="flex-1 border-t border-[#d4d4d4] font-[500] font-['Noto_Sans_JP'] text-[12px] text-black text-center px-[12px] py-[15px]">
                      {getStatusLabel(record.status)}
                    </td>
                    <td className="flex-1 border-t border-[#d4d4d4] font-[500] font-['Noto_Sans_JP'] text-[14px] text-black text-center px-[12px] py-[15px]">
                      <button
                        type="button"
                        className="bg-transparent border-none font-[500] font-['Noto_Sans_JP'] text-[12px] text-[#066a9e] cursor-pointer p-0 hover:underline"
                        onClick={() => handleDownloadInvoice(record.id)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
