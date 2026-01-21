"use client";

import Image from "next/image";
import { RefObject } from "react";
import { VendorMessage, VendorThreadMessage } from "../../models";

interface MessageDetailProps {
  selectedMessage: VendorMessage | undefined;
  threadMessages: VendorThreadMessage[];
  newMessage: string;
  messageContainerRef: RefObject<HTMLDivElement | null>;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function MessageDetail({
  selectedMessage,
  threadMessages,
  newMessage,
  messageContainerRef,
  onNewMessageChange,
  onSendMessage,
  onKeyDown,
}: MessageDetailProps) {
  if (!selectedMessage) {
    return (
      <div className="flex flex-col flex-1 h-full bg-white w-[751px]">
        <div className="flex justify-center items-center w-full h-full">
          <p className="font-normal text-[16px] leading-[22px] text-[#808080] m-0">
            バイヤーを選択してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-white w-[751px]">
      {/* Header */}
      <div className="flex justify-between items-center py-[10px] px-[25px] border-b border-[#d9d9d9] flex-shrink-0">
        <div className="flex flex-col gap-[5px]">
          <h2 className="font-bold text-[16px] leading-[22px] text-[#333333] m-0">
            {selectedMessage.companyName}
          </h2>
          <div className="flex items-center py-[4px] px-[10px] border border-[#066a9e] rounded-full">
            <span className="font-medium text-[14px] leading-[19px] text-[#066a9e]">
              {selectedMessage.projectName}
            </span>
          </div>
        </div>
        <div className="flex items-center p-[3px]">
          <Image
            src="/assets/icons/document-stack.svg"
            alt="Documents"
            width={29}
            height={30}
          />
        </div>
      </div>

      {/* Message Content Area */}
      <div className="flex flex-col flex-1 justify-between py-[25px] px-[25px] pb-[35px]">
        {/* Message Thread */}
        <div
          className="flex flex-col gap-[10px] w-full overflow-y-auto"
          ref={messageContainerRef}
        >
          {threadMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isFromUser ? "justify-end" : "items-start gap-[10px]"
                }`}
            >
              {!msg.isFromUser && (
                <div className="w-[25px] h-[25px] bg-[#808080] rounded-full flex-shrink-0" />
              )}
              <div
                className={`flex flex-col gap-[2px] w-full max-w-[301px] ${msg.isFromUser ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`flex justify-center items-center p-[7px] w-full rounded ${msg.isFromUser
                    ? "bg-[#e6f3f5] border border-[#8ec0d0]"
                    : "bg-white border border-[#8ec0d0]"
                    }`}
                >
                  <p className="flex-1 font-normal text-[13px] leading-normal text-[#333333] m-0 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
                <span className="font-normal text-[10px] leading-[19px] text-center text-[#808080]">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex justify-center items-center w-full flex-shrink-0">
          <div className="flex justify-between items-center py-[10px] pr-[10px] pl-[15px] w-full border border-[#b9b9b9] rounded">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => onNewMessageChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="メッセージを入力"
              className="flex-1 outline-none border-none bg-transparent font-normal text-[14px] leading-[19px] text-[#333333] placeholder:text-[#808080]"
            />
            <button
              type="button"
              className="flex items-center justify-center w-[20px] h-[20px] cursor-pointer bg-transparent border-none p-0 hover:opacity-80"
              onClick={onSendMessage}
            >
              <Image
                src="/assets/icons/send.svg"
                alt="Send"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
