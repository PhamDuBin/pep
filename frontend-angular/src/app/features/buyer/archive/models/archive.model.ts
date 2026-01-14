/**
 * Represents an archived project
 */
export interface ArchiveProject {
  id: string;
  name: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isFavorite: boolean;
}

/**
 * Filter option for project dropdown
 */
export interface ProjectFilterOption {
  id: string;
  name: string;
  isSelected: boolean;
}

/**
 * Sort order type
 */
export type SortOrder = 'desc' | 'asc';

/**
 * Sort option
 */
export interface SortOption {
  value: SortOrder;
  label: string;
  isSelected: boolean;
}

/**
 * View mode type
 */
export type ViewMode = 'grid' | 'list';

/**
 * Context menu action type
 */
export type ContextMenuAction = 'download' | 'rename' | 'favorite' | 'delete';

/**
 * Context menu item
 */
export interface ContextMenuItem {
  action: ContextMenuAction;
  label: string;
}

/**
 * API Response for archive projects list
 */
export interface ArchiveProjectsResponse {
  projects: ArchiveProject[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * API Request for archive projects
 */
export interface ArchiveProjectsRequest {
  filterBy?: string; // 'all' or author id
  sortBy?: 'createdAt';
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

/**
 * API Response for project actions
 */
export interface ProjectActionResponse {
  success: boolean;
  message?: string;
}
