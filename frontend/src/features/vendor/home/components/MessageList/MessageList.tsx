"use client";

import { VendorMessage } from "../../types";
import Image from "next/image";

interface MessageListProps {
  messages: VendorMessage[];
  selectedMessageId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectMessage: (messageId: string) => void;
}

export function MessageList({
  messages,
  selectedMessageId,
  searchQuery,
  onSearchChange,
  onSelectMessage,
}: MessageListProps) {
  return (
    <div className="flex flex-col items-center py-[25px] gap-[10px] w-[357px] h-full bg-[#f5f5f5] border-r border-[#e1e1e1] flex-shrink-0">
      {/* Header */}
      <div className="w-[160px] h-[22px]">
        <h2 className="font-bold text-[16px] leading-[22px] text-[#333333] m-0">
          全てのメッセージ一覧
        </h2>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col items-start px-[15px] gap-[10px] w-[357px] h-[40px]">
        <div className="box-border flex items-center py-[10px] px-[15px] gap-[10px] w-[327px] h-[40px] bg-white border border-[#8ec0d0] rounded-full cursor-pointer transition-colors duration-200 hover:border-[#066a9e]">
          <Image
            src="/assets/icons/find-blue.svg"
            alt="Project Plan"
            width={24}
            height={24}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 outline-none border-none bg-transparent text-[13px] text-[#333333] placeholder:text-[#808080]"
            placeholder="検索..."
          />
        </div>
      </div>

      {/* Message Items */}
      <div className="flex flex-col items-start w-[357px] flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`box-border flex justify-end items-start p-[15px] gap-[10px] w-[357px] min-h-[87px] border-b border-[#e1e1e1] cursor-pointer transition-colors duration-200 ${
              message.id === selectedMessageId ? "bg-white" : "hover:bg-white"
            }`}
            onClick={() => onSelectMessage(message.id)}
          >
            <div className="flex flex-col items-start gap-[3px] flex-1 min-w-0">
              <div className="font-bold text-[13px] leading-normal text-[#333333]">
                {message.projectName}
              </div>
              <p className="font-normal text-[13px] leading-normal text-[#333333] m-0 w-full overflow-hidden text-ellipsis line-clamp-2 whitespace-pre-wrap">
                {message.preview}
              </p>
            </div>
            <div className="flex flex-col items-end gap-[10px] w-[55px]">
              <span className="font-normal text-[10px] leading-[19px] text-center text-[#333333] w-[55px] h-[19px]">
                {message.timestamp}
              </span>
              {message.unreadCount > 0 && (
                <div className="flex flex-col justify-center items-center w-[20px] h-[20px] bg-[#066a9e] rounded-full font-normal text-[13px] leading-[19px] text-center text-white">
                  {message.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
