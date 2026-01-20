// =============================================================================
// ARCHIVE SERVICE
// =============================================================================

import {
  ArchiveProject,
  ProjectFilterOption,
  SortOption,
  ProjectActionResponse,
} from "../types";
import {
  ARCHIVE_PROJECTS_MOCK,
  PROJECT_FILTER_OPTIONS_MOCK,
  SORT_OPTIONS_MOCK,
} from "../mock/archive.data";

const USE_MOCK = true;

/**
 * Get archive projects
 */
export async function getArchiveProjects(): Promise<ArchiveProject[]> {
  if (USE_MOCK) {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return ARCHIVE_PROJECTS_MOCK;
  }

  const res = await fetch("/api/archive/projects");
  if (!res.ok) throw new Error("Failed to fetch archive projects");

  return res.json();
}

/**
 * Get project filter options
 */
export async function getProjectFilterOptions(): Promise<ProjectFilterOption[]> {
  if (USE_MOCK) {
    return PROJECT_FILTER_OPTIONS_MOCK;
  }

  const res = await fetch("/api/archive/filters");
  if (!res.ok) throw new Error("Failed to fetch filter options");

  return res.json();
}

/**
 * Get sort options
 */
export async function getSortOptions(): Promise<SortOption[]> {
  if (USE_MOCK) {
    return SORT_OPTIONS_MOCK;
  }

  const res = await fetch("/api/archive/sort-options");
  if (!res.ok) throw new Error("Failed to fetch sort options");

  return res.json();
}

/**
 * Download project
 */
export async function downloadProject(
  projectId: string
): Promise<ProjectActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }

  const res = await fetch(`/api/archive/projects/${projectId}/download`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to download project");

  return res.json();
}

/**
 * Rename project
 */
export async function renameProject(
  projectId: string,
  newName: string
): Promise<ProjectActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const res = await fetch(`/api/archive/projects/${projectId}/rename`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName }),
  });

  if (!res.ok) throw new Error("Failed to rename project");

  return res.json();
}

/**
 * Toggle project favorite status
 */
export async function toggleProjectFavorite(
  projectId: string
): Promise<ProjectActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true };
  }

  const res = await fetch(`/api/archive/projects/${projectId}/favorite`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to toggle favorite");

  return res.json();
}

/**
 * Delete project
 */
export async function deleteProject(
  projectId: string
): Promise<ProjectActionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  }

  const res = await fetch(`/api/archive/projects/${projectId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete project");

  return res.json();
}
