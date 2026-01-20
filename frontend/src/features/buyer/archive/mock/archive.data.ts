// =============================================================================
// ARCHIVE MOCK DATA
// =============================================================================

import {
  ArchiveProject,
  ProjectFilterOption,
  SortOption,
  ContextMenuItem,
} from "../models";

export const ARCHIVE_PROJECTS_MOCK: ArchiveProject[] = [
  {
    id: "archive-1",
    name: "AIタレント・バーチャルヒューマンの開発",
    authorId: "user-1",
    authorName: "山田 太郎",
    createdAt: "2026/4/10",
    isFavorite: false,
  },
  {
    id: "archive-2",
    name: "ブランド体験型ポップアップスペース",
    authorId: "user-2",
    authorName: "東 次郎",
    createdAt: "2026/3/21",
    isFavorite: false,
  },
  {
    id: "archive-3",
    name: "ライブコマース運営受託事業",
    authorId: "user-5",
    authorName: "福岡 麻美",
    createdAt: "2026/02/03",
    isFavorite: false,
  },
  {
    id: "archive-4",
    name: "ドーナツPRイベント開催",
    authorId: "user-2",
    authorName: "東 次郎",
    createdAt: "2026/01/29",
    isFavorite: false,
  },
  {
    id: "archive-5",
    name: "Z世代向けインフルエンサー施策",
    authorId: "user-1",
    authorName: "山田 太郎",
    createdAt: "2026/01/10",
    isFavorite: true,
  },
  {
    id: "archive-6",
    name: "SNSショート動画運用代行",
    authorId: "user-2",
    authorName: "東 次郎",
    createdAt: "2025/12/10",
    isFavorite: false,
  },
];

export const PROJECT_FILTER_OPTIONS_MOCK: ProjectFilterOption[] = [
  { id: "all", name: "すべてのプロジェクト", isSelected: true },
  { id: "user-1", name: "山田 太郎", isSelected: false },
  { id: "user-2", name: "東 次郎", isSelected: false },
  { id: "user-3", name: "宮崎 花子", isSelected: false },
  { id: "user-4", name: "千葉 三郎", isSelected: false },
  { id: "user-5", name: "福岡 麻美", isSelected: false },
];

export const SORT_OPTIONS_MOCK: SortOption[] = [
  { value: "desc", label: "降順", isSelected: true },
  { value: "asc", label: "昇順", isSelected: false },
];

export const CONTEXT_MENU_ITEMS_MOCK: ContextMenuItem[] = [
  { action: "download", label: "ダウンロード" },
  { action: "rename", label: "名前を変更" },
  { action: "favorite", label: "お気に入り" },
  { action: "delete", label: "削除" },
];

export const DEFAULT_PAGE_SIZE_MOCK = 7;
export const DEFAULT_SORT_FIELD_MOCK = "createdAt";
