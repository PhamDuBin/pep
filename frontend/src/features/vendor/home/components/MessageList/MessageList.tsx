"use client";

import { VendorMessage } from "../../types";

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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.7555 18.6065L16.3182 15.2458C17.7011 13.6129 18.4945 11.5329 18.4945 9.29776C18.4945 4.16878 14.3259 0 9.19679 0C4.06766 0 -0.100952 4.16878 -0.100952 9.29776C-0.100952 14.4267 4.06766 18.5955 9.19679 18.5955C11.2924 18.5955 13.2501 17.8915 14.8371 16.6461L18.3102 20.0452C18.5707 20.2946 18.9089 20.4194 19.2328 20.4194C19.5425 20.4194 19.8664 20.3089 20.1198 20.0738C20.6551 19.5741 20.6836 18.7414 20.1838 18.2062L19.7555 18.6065ZM9.19679 2.01392C13.2145 2.01392 16.4806 5.27994 16.4806 9.29776C16.4806 13.3156 13.2145 16.5816 9.19679 16.5816C5.17897 16.5816 1.91295 13.3156 1.91295 9.29776C1.91295 5.27994 5.17897 2.01392 9.19679 2.01392Z"
              fill="#066A9E"
            />
          </svg>
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
              message.id === selectedMessageId
                ? "bg-white"
                : "hover:bg-white"
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
