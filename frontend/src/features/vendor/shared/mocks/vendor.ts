// =============================================================================
// VENDOR MOCKS
// =============================================================================

import { VendorCompany, VendorMessage, VendorMessageThread, VendorUser, VendorPaymentInfo, VendorPaymentHistory } from "../types/vendor";

export const MOCK_VENDOR_COMPANIES: VendorCompany[] = [
  {
    id: "1",
    name: "株式会社ソラマメ",
    isSelected: true,
  },
  {
    id: "2",
    name: "株式会社キャベツ",
    isSelected: false,
  },
  {
    id: "3",
    name: "株式会社トマト",
    isSelected: false,
  },
];

export const MOCK_VENDOR_MESSAGES: VendorMessage[] = [
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

export const MOCK_VENDOR_MESSAGE_THREADS: VendorMessageThread[] = [
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

export const MOCK_VENDOR_CURRENT_USER: VendorUser = {
  id: "1",
  name: "山口 太郎",
  initials: "山口",
  email: "yamaguchi@example.com",
  avatarColor: "#8EC5D0",
  avatarUrl: undefined,
};

export const MOCK_VENDOR_USER_PROFILE = {
  id: "1",
  name: "山口 太郎",
  initials: "山口",
  email: "yamaguchi@example.com",
  avatarColor: "#8EC5D0",
  avatarUrl: undefined,
};

export const MOCK_VENDOR_PAYMENT_INFO: VendorPaymentInfo = {
  nextPaymentDate: "2024年12月15日",
  amount: 30000,
  paymentMethod: {
    type: "visa",
    lastFourDigits: "4242",
  },
};

export const MOCK_VENDOR_PAYMENT_HISTORY: VendorPaymentHistory[] = [
  {
    id: "p1",
    paymentDate: "2024/11/15",
    amount: 30000,
    billingPeriod: "2024年11月",
    status: "支払済",
    invoiceUrl: "#",
  },
  {
    id: "p2",
    paymentDate: "2024/10/15",
    amount: 30000,
    billingPeriod: "2024年10月",
    status: "支払済",
    invoiceUrl: "#",
  },
  {
    id: "p3",
    paymentDate: "2024/09/15",
    amount: 30000,
    billingPeriod: "2024年9月",
    status: "支払済",
    invoiceUrl: "#",
  },
];

export const MOCK_VENDOR_USERS: VendorUser[] = [
  {
    id: "u1",
    name: "山口 太郎",
    initials: "山口",
    email: "yamaguchi@example.com",
    avatarColor: "#8EC5D0",
    role: "管理者",
    selected: false,
  },
  {
    id: "u2",
    name: "佐藤 花子",
    initials: "佐藤",
    email: "sato@example.com",
    avatarColor: "#8EC5D0",
    role: "メンバー",
    selected: false,
  },
  {
    id: "u3",
    name: "鈴木 一郎",
    initials: "鈴木",
    email: "suzuki@example.com",
    avatarColor: "#8EC5D0",
    role: "メンバー",
    selected: false,
  },
];
