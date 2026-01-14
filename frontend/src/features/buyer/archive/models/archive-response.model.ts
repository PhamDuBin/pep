// =============================================================================
// ARCHIVE RESPONSE MODEL
// =============================================================================

import { ArchiveProject } from "./archive-project.model";
import { SortOrder } from "../types";

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
