import { VendorContact, VendorChatMessage, VendorConversation } from "@/types";

export const CURRENT_PROJECT_NAME = "AIを利用した花屋の業務効率化";

export const MOCK_VENDOR_CONTACTS: VendorContact[] = [
  {
    id: "vendor-1",
    name: "株式会社イチジク",
    lastMessage: "山田太郎 がRFPを送信しました。",
    lastMessageTime: "12/02 11:49",
    isSelected: false,
  },
  {
    id: "vendor-2",
    name: "株式会社チェリー",
    lastMessage: "山田太郎がRFPを送信しました。",
    lastMessageTime: "12/01 15:41",
    isSelected: false,
  },
  {
    id: "vendor-3",
    name: "株式会社ピーチ",
    lastMessage: "山田太郎がRFPを送信しました。",
    lastMessageTime: "12/01 15:41",
    isSelected: false,
  },
  {
    id: "vendor-4",
    name: "株式会社メロン",
    lastMessage: "山田太郎がRFPを送信しました。",
    lastMessageTime: "12/01 15:41",
    isSelected: false,
  },
  {
    id: "vendor-5",
    name: "株式会社バナナ",
    lastMessage: "山田太郎がRFPを送信しました。",
    lastMessageTime: "12/01 15:41",
    isSelected: false,
  },
  {
    id: "vendor-6",
    name: "株式会社レモン",
    lastMessage: "山田太郎がRFPを送信しました。",
    lastMessageTime: "12/01 15:41",
    isSelected: false,
  },
  {
    id: "vendor-7",
    name: "株式会社パパイヤ",
    lastMessage: "山田太郎がRFPを送信しました。",
    lastMessageTime: "12/01 15:41",
    isSelected: false,
  },
  {
    id: "vendor-8",
    name: "株式会社ペアー",
    lastMessage: "山田太郎がRFPを送信しました。",
    lastMessageTime: "12/01 15:41",
    isSelected: false,
  },
];

export const MOCK_VENDOR_CHAT_MESSAGES: VendorChatMessage[] = [
  {
    id: "msg-1",
    content:
      "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    timestamp: "12/02 11:49",
    sender: "vendor",
    senderName: "安藤 一郎",
  },
  {
    id: "msg-2",
    content:
      "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    timestamp: "12/02 11:49",
    sender: "buyer",
    senderName: "山田 太郎",
  },
  {
    id: "msg-3",
    content:
      "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    timestamp: "12/02 11:49",
    sender: "vendor",
    senderName: "田中 次郎",
  },
  {
    id: "msg-4",
    content:
      "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
    timestamp: "12/02 11:49",
    sender: "buyer",
    senderName: "山田 太郎",
  },
];

export const MOCK_CONVERSATION: VendorConversation = {
  vendorId: "vendor-1",
  vendorName: "株式会社イチジク",
  memberCount: 3,
  messages: MOCK_VENDOR_CHAT_MESSAGES,
};

export const EMPTY_VENDOR_SELECTION_MESSAGE = "ベンダーを選択してください";
export const MESSAGE_INPUT_PLACEHOLDER = "メッセージを入力";
export const MESSAGE_LIST_TITLE = "メッセージ一覧";
