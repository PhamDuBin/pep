// =============================================================================
// VENDOR USER LIST MOCK DATA
// =============================================================================

import { VendorUser, PermissionOption } from "../types";

export type VendorUserPermission = "管理者" | "メンバー";

export const VENDOR_USERS_MOCK: VendorUser[] = [
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

export const VENDOR_PERMISSION_OPTIONS_MOCK: PermissionOption[] = [
  { value: "管理者", label: "管理者" },
  { value: "メンバー", label: "メンバー" },
];

export const VENDOR_PERMISSION_LABELS_MOCK: Record<VendorUserPermission, string> = {
  "管理者": "管理者",
  "メンバー": "メンバー",
};
