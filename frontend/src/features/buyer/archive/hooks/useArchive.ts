"use client";

// =============================================================================
// ARCHIVE HOOK
// =============================================================================

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ArchiveProject, ProjectFilterOption, SortOption } from "../models";
import { SortOrder, ViewMode } from "../types";
import {
  getArchiveProjects,
  getProjectFilterOptions,
  getSortOptions,
  toggleProjectFavorite,
} from "../services/archive.service";

export function useArchive() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ArchiveProject[]>([]);
  const [filterOptions, setFilterOptions] = useState<ProjectFilterOption[]>([]);
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Project Plan Modal state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ArchiveProject | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [projectsData, filtersData, sortData] = await Promise.all([
          getArchiveProjects(),
          getProjectFilterOptions(),
          getSortOptions(),
        ]);
        setProjects(projectsData);
        setFilterOptions(filtersData);
        setSortOptions(sortData);
      } catch (error) {
        console.error("Failed to load archive data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedFilterLabel = useMemo(() => {
    const option = filterOptions.find((o) => o.id === selectedFilter);
    return option ? option.name : "すべて";
  }, [selectedFilter, filterOptions]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return projects
      .filter((p) => selectedFilter === "all" || p.authorId === selectedFilter)
      .filter((p) => !showOnlyFavorites || p.isFavorite)
      .filter((p) => {
        if (!normalizedQuery) return true;
        return (
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.authorName.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt.replace(/\//g, "-")).getTime();
        const dateB = new Date(b.createdAt.replace(/\//g, "-")).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [projects, selectedFilter, sortOrder, searchQuery, showOnlyFavorites]);

  const handleViewModeToggle = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  }, []);

  const handleFilterSelect = useCallback((filterId: string) => {
    setSelectedFilter(filterId);
    setShowFilterDropdown(false);
  }, []);

  const handleSortSelect = useCallback((value: SortOrder) => {
    setSortOrder(value);
    setShowSortDropdown(false);
  }, []);

  const handleContextMenuToggle = useCallback((projectId: string) => {
    setOpenContextMenuId((prev) => (prev === projectId ? null : projectId));
  }, []);

  const handleContextMenuClose = useCallback(() => {
    setOpenContextMenuId(null);
  }, []);

  const handleContextAction = useCallback((projectId: string, action: string) => {
    console.log(`Action: ${action} for project: ${projectId}`);
    setOpenContextMenuId(null);
  }, []);

  const handleProjectClick = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setShowPlanModal(true);
      }
    },
    [projects]
  );

  const handlePlanModalClose = useCallback(() => {
    setShowPlanModal(false);
    setSelectedProject(null);
  }, []);

  const handleFavoriteToggle = useCallback(async (projectId: string) => {
    try {
      const result = await toggleProjectFavorite(projectId);
      if (result.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  }, []);

  const handleFilterDropdownToggle = useCallback(() => {
    setShowFilterDropdown((prev) => !prev);
  }, []);

  const handleSortDropdownToggle = useCallback(() => {
    setShowSortDropdown((prev) => !prev);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFavoriteFilterToggle = useCallback(() => {
    setShowOnlyFavorites((prev) => !prev);
  }, []);

  return {
    isLoading,
    viewMode,
    selectedFilter,
    selectedFilterLabel,
    sortOrder,
    showFilterDropdown,
    showSortDropdown,
    openContextMenuId,
    filteredProjects,
    filterRef,
    sortRef,
    filterOptions,
    sortOptions,
    showPlanModal,
    selectedProject,
    searchQuery,
    showOnlyFavorites,
    handleViewModeToggle,
    handleFilterSelect,
    handleSortSelect,
    handleContextMenuToggle,
    handleContextMenuClose,
    handleContextAction,
    handleProjectClick,
    handlePlanModalClose,
    handleFilterDropdownToggle,
    handleSortDropdownToggle,
    handleFavoriteToggle,
    handleSearchChange,
    handleFavoriteFilterToggle,
  };
}
