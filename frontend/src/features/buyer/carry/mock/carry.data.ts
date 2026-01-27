// =============================================================================
// BUYER CARRY MOCK DATA
// =============================================================================

import {
  VendorContact,
  VendorChatMessage,
  VendorConversation,
  Tab,
  ChatMember,
  SearchableUser,
} from "../models";

export const CURRENT_PROJECT_NAME_MOCK = "AIを利用した花屋の業務効率化";

export const VENDOR_CONTACTS_MOCK: VendorContact[] = [
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

export const VENDOR_CHAT_MESSAGES_MOCK: VendorChatMessage[] = [
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

export const CONVERSATION_MOCK: VendorConversation = {
  vendorId: "vendor-1",
  vendorName: "株式会社イチジク",
  memberCount: 3,
  messages: VENDOR_CHAT_MESSAGES_MOCK,
};

export const MEMBERS_MOCK: ChatMember[] = [
  { id: "1", name: "山田 太郎", initials: "山", organization: "buyer" },
  { id: "2", name: "佐藤 花子", initials: "佐", organization: "buyer" },
  { id: "3", name: "田中 次郎", initials: "田", organization: "vendor" },
];

export const CARRY_TABS_MOCK: Tab[] = [
  {
    id: "kick",
    label: "kick",
    subLabel: "(AI Chat)",
    icon: "kick",
    isActive: false,
    isDisabled: false,
  },
  {
    id: "carry",
    label: "carry",
    subLabel: "(コミュニケーション)",
    icon: "carry",
    isActive: true,
    isDisabled: false,
  },
];

export const EMPTY_VENDOR_SELECTION_MESSAGE_MOCK = "ベンダーを選択してください";
export const MESSAGE_INPUT_PLACEHOLDER_MOCK = "メッセージを入力";
export const MESSAGE_LIST_TITLE_MOCK = "メッセージ一覧";

export const SEARCHABLE_USERS_MOCK: SearchableUser[] = [
  { id: "user-1", name: "鈴木 一郎", email: "suzuki@example.com", initials: "鈴", organization: "buyer" },
  { id: "user-2", name: "高橋 美咲", email: "takahashi@example.com", initials: "高", organization: "buyer" },
  { id: "user-3", name: "渡辺 健太", email: "watanabe@example.com", initials: "渡", organization: "vendor" },
  { id: "user-4", name: "伊藤 さくら", email: "ito@example.com", initials: "伊", organization: "buyer" },
  { id: "user-5", name: "中村 大輔", email: "nakamura@example.com", initials: "中", organization: "vendor" },
  { id: "user-6", name: "小林 由美", email: "kobayashi@example.com", initials: "小", organization: "buyer" },
  { id: "user-7", name: "加藤 翔太", email: "kato@example.com", initials: "加", organization: "vendor" },
  { id: "user-8", name: "吉田 愛", email: "yoshida@example.com", initials: "吉", organization: "buyer" },
];
