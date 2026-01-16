"use client";

import { Modal } from "@/shared/components";

interface Vendor {
  id: string;
  name: string;
  isSelected: boolean;
}

interface VendorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleVendor: (vendorId: string) => void;
  selectedCount: number;
  isSending: boolean;
  onSend: () => void;
}

export function VendorSelectionModal({
  isOpen,
  onClose,
  vendors,
  searchQuery,
  onSearchChange,
  onToggleVendor,
  selectedCount,
  isSending,
  onSend,
}: VendorSelectionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="送信先のベンダーを選択"
      size="lg"
    >
      <div className="relative w-full mb-[8px]">
        <div className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#808080] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M19.0337 19.8332C19.5512 20.3478 20.3498 19.5535 19.8324 19.0501L15.6139 14.8441C17.094 13.2162 17.9121 11.0989 17.9088 8.90424C17.9088 3.99348 13.8928 0 8.95438 0C4.01597 0 0 3.99348 0 8.90424C0 13.815 4.01597 17.8085 8.95438 17.8085C11.1817 17.8085 13.2403 16.9919 14.8152 15.6383L19.0337 19.8332ZM1.1238 8.90424C1.1238 4.60873 4.6448 1.11862 8.95326 1.11862C13.273 1.11862 16.7827 4.60873 16.7827 8.90424C16.7827 13.1998 13.273 16.6899 8.95326 16.6899C4.6448 16.6899 1.1238 13.1998 1.1238 8.90424Z"
              fill="#066A9E"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ベンダーを検索..."
          className="w-full h-[45px] pl-[48px] pr-[16px] border border-[#066a9e] rounded-full text-[14px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(6,106,158,0.3)] placeholder:text-[#808080]"
        />
      </div>

      <div className="max-h-[350px] overflow-y-auto p-[8px] w-full bg-[#f5f5f4] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-[#f1f1f1] [&::-webkit-scrollbar-track]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[#a1a1a1]">
        <div className="grid grid-cols-3 gap-y-[12px] gap-x-[16px] w-full">
          {vendors.map((vendor) => (
            <label
              key={vendor.id}
              className={`flex items-center gap-[8px] py-[8px] cursor-pointer transition-colors duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] rounded-[4px] hover:bg-[#f9fafb] [&>span]:text-[14px] [&>span]:text-[#333333] ${
                vendor.isSelected ? "bg-[rgba(51,51,51,0.05)]" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={vendor.isSelected}
                onChange={() => onToggleVendor(vendor.id)}
                className="appearance-none w-[20px] h-[20px] border-2 border-[#b9b9b9] rounded-[4px] bg-[#ffffff] cursor-pointer transition-all duration-200 checked:bg-[#333333] checked:border-[#333333] checked:bg-[url('data:image/svg+xml,%3csvg%20viewBox=%270%200%2016%2016%27%20fill=%27white%27%20xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath%20d=%27M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%27/%3e%3c/svg%3e')] checked:bg-[length:100%_100%] checked:bg-center checked:bg-no-repeat hover:border-[#333333] focus:outline-none focus:shadow-[0_0_0_2px_rgba(51,51,51,0.3)]"
              />
              <span>{vendor.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-[24px]">
        <button
          type="button"
          className="py-[10px] px-[20px] bg-[#066a9e] text-[#ffffff] border-none rounded-[4px] text-[14px] cursor-pointer transition-opacity duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] min-w-[80px] flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSend}
          disabled={selectedCount === 0 || isSending}
        >
          {isSending ? (
            <span className="inline-block w-[16px] h-[16px] border-2 border-[rgba(255,255,255,0.3)] border-t-[#ffffff] rounded-full animate-spin"></span>
          ) : (
            "送信"
          )}
        </button>
      </div>
    </Modal>
  );
}
