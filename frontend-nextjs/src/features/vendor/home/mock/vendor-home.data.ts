// =============================================================================
// VENDOR HOME MOCK DATA
// =============================================================================

import { VendorMessage, VendorMessageThread } from "../types";

export const VENDOR_MESSAGES_MOCK: VendorMessage[] = [
  {
    id: "1",
    companyId: "1",
    companyName: "株式会社ABC",
    projectName: "SNSショート動画運用代行",
    preview: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト....",
    timestamp: "12/02 13:23",
    unreadCount: 1,
    isSelected: false,
  },
  {
    id: "2",
    companyId: "1",
    companyName: "株式会社ABC",
    projectName: "ブランド体験型ポップアップスペース",
    preview: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト....",
    timestamp: "12/02 11:49",
    unreadCount: 0,
    isSelected: false,
  },
  {
    id: "3",
    companyId: "2",
    companyName: "株式会社XYZ",
    projectName: "Webサイトリニューアル",
    preview: "お世話になっております。先日お送りいただいた資料について確認させていただきました....",
    timestamp: "12/01 15:30",
    unreadCount: 2,
    isSelected: false,
  },
  {
    id: "4",
    companyId: "3",
    companyName: "株式会社DEF",
    projectName: "ECサイト構築",
    preview: "ご提案いただいた内容について、社内で検討させていただきました....",
    timestamp: "11/30 09:15",
    unreadCount: 0,
    isSelected: false,
  },
];

export const VENDOR_MESSAGE_THREADS_MOCK: VendorMessageThread[] = [
  {
    id: "thread-1",
    messageId: "1",
    messages: [
      {
        id: "m1",
        content: "テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト",
        timestamp: "12/02 13:23",
        isFromUser: false,
      },
      {
        id: "m2",
        content: "お問い合わせありがとうございます。ご質問の件について、回答させていただきます。",
        timestamp: "12/02 13:30",
        isFromUser: true,
      },
      {
        id: "m3",
        content: "ありがとうございます。追加で確認したい点がございます。",
        timestamp: "12/02 13:35",
        isFromUser: false,
      },
    ],
  },
  {
    id: "thread-2",
    messageId: "2",
    messages: [
      {
        id: "m4",
        content: "ブランド体験型ポップアップスペースの件でご連絡いたしました。",
        timestamp: "12/02 11:49",
        isFromUser: false,
      },
      {
        id: "m5",
        content: "ご連絡ありがとうございます。詳細について確認させてください。",
        timestamp: "12/02 12:00",
        isFromUser: true,
      },
    ],
  },
  {
    id: "thread-3",
    messageId: "3",
    messages: [
      {
        id: "m6",
        content: "お世話になっております。先日お送りいただいた資料について確認させていただきました。",
        timestamp: "12/01 15:30",
        isFromUser: false,
      },
    ],
  },
  {
    id: "thread-4",
    messageId: "4",
    messages: [
      {
        id: "m7",
        content: "ご提案いただいた内容について、社内で検討させていただきました。",
        timestamp: "11/30 09:15",
        isFromUser: false,
      },
    ],
  },
];
