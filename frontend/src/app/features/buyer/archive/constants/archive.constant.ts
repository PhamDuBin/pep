import {
  ArchiveProject,
  ProjectFilterOption,
  SortOption,
  ContextMenuItem
} from '../models/archive.model';

/**
 * Mock archived projects data matching Figma design
 */
export const MOCK_ARCHIVE_PROJECTS: ArchiveProject[] = [
  {
    id: 'archive-1',
    name: 'AIタレント・バーチャルヒューマンの開発',
    authorId: 'user-1',
    authorName: '山田 太郎',
    createdAt: '2026/4/10',
    isFavorite: false
  },
  {
    id: 'archive-2',
    name: 'AIタレント・バーチャルヒューマンの開発',
    authorId: 'user-1',
    authorName: '山田 太郎',
    createdAt: '2026/4/10',
    isFavorite: false
  },
  {
    id: 'archive-3',
    name: 'AIタレント・バーチャルヒューマンの開発',
    authorId: 'user-1',
    authorName: '山田 太郎',
    createdAt: '2026/4/10',
    isFavorite: false
  },
  {
    id: 'archive-4',
    name: 'AIタレント・バーチャルヒューマンの開発',
    authorId: 'user-1',
    authorName: '山田 太郎',
    createdAt: '2026/4/10',
    isFavorite: false
  },
  {
    id: 'archive-5',
    name: 'AIタレント・バーチャルヒューマンの開発',
    authorId: 'user-1',
    authorName: '山田 太郎',
    createdAt: '2026/4/10',
    isFavorite: false
  },
  {
    id: 'archive-6',
    name: 'AIタレント・バーチャルヒューマンの開発',
    authorId: 'user-1',
    authorName: '山田 太郎',
    createdAt: '2026/4/10',
    isFavorite: false
  },
  {
    id: 'archive-7',
    name: 'AIタレント・バーチャルヒューマンの開発',
    authorId: 'user-1',
    authorName: '山田 太郎',
    createdAt: '2026/4/10',
    isFavorite: false
  }
];

/**
 * Project filter options matching Figma design
 */
export const PROJECT_FILTER_OPTIONS: ProjectFilterOption[] = [
  { id: 'all', name: 'すべてのプロジェクト', isSelected: true },
  { id: 'user-1', name: '山田 太郎', isSelected: false },
  { id: 'user-2', name: '東 次郎', isSelected: false },
  { id: 'user-3', name: '宮崎 花子', isSelected: false },
  { id: 'user-4', name: '千葉 三郎', isSelected: false },
  { id: 'user-5', name: '福岡 麻美', isSelected: false }
];

/**
 * Sort options matching Figma design
 */
export const SORT_OPTIONS: SortOption[] = [
  { value: 'desc', label: '降順', isSelected: true },
  { value: 'asc', label: '昇順', isSelected: false }
];

/**
 * Context menu items matching Figma design
 */
export const CONTEXT_MENU_ITEMS: ContextMenuItem[] = [
  { action: 'download', label: 'ダウンロード' },
  { action: 'rename', label: '名前を変更' },
  { action: 'favorite', label: 'お気に入り' },
  { action: 'delete', label: '削除' }
];

/**
 * Page size for pagination
 */
export const DEFAULT_PAGE_SIZE = 7;

/**
 * Default sort field
 */
export const DEFAULT_SORT_FIELD = 'createdAt';
