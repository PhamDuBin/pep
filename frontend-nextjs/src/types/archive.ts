// Archive related types

export interface ArchiveProject {
  id: string;
  name: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isFavorite: boolean;
}

export interface ProjectFilterOption {
  id: string;
  name: string;
  isSelected: boolean;
}

export type SortOrder = "desc" | "asc";

export interface SortOption {
  value: SortOrder;
  label: string;
  isSelected: boolean;
}

export type ViewMode = "grid" | "list";

export type ContextMenuAction = "download" | "rename" | "favorite" | "delete";

export interface ContextMenuItem {
  action: ContextMenuAction;
  label: string;
}

export interface ArchiveProjectsResponse {
  projects: ArchiveProject[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ArchiveProjectsRequest {
  filterBy?: string;
  sortBy?: "createdAt";
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

export interface ProjectActionResponse {
  success: boolean;
  message?: string;
}
