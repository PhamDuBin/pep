import { User, PermissionOption, UserPermission } from "@/types";

export const MOCK_USERS: User[] = [
  {
    id: "user-001",
    name: "山田 太郎",
    initials: "TY",
    avatarColor: "#8ec5d0",
    permission: "admin",
    email: "yamada@example.com",
    isSelected: false,
  },
  {
    id: "user-002",
    name: "宮崎 花子",
    initials: "MH",
    avatarColor: "#8ec5d0",
    permission: "member",
    email: "miyazaki@example.com",
    isSelected: false,
  },
  {
    id: "user-003",
    name: "東 次郎",
    initials: "HJ",
    avatarColor: "#8ec5d0",
    permission: "member",
    email: "higashi@example.com",
    isSelected: false,
  },
  {
    id: "user-004",
    name: "千葉 三郎",
    initials: "CS",
    avatarColor: "#8ec5d0",
    permission: "member",
    email: "chiba@example.com",
    isSelected: false,
  },
  {
    id: "user-005",
    name: "福岡 麻美",
    initials: "FA",
    avatarColor: "#8ec5d0",
    permission: "admin",
    email: "fukuoka@example.com",
    isSelected: false,
  },
];

export const PERMISSION_OPTIONS: PermissionOption[] = [
  {
    value: "admin",
    label: "管理者",
  },
  {
    value: "member",
    label: "メンバー",
  },
];

export const PERMISSION_LABELS: Record<UserPermission, string> = {
  admin: "管理者",
  member: "メンバー",
};
