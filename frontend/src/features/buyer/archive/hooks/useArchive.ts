"use client";

// =============================================================================
// ARCHIVE HOOK
// =============================================================================

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { ArchiveProject, SortOrder, ViewMode, ProjectFilterOption, SortOption } from "../types";
import {
  getArchiveProjects,
  getProjectFilterOptions,
  getSortOptions,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    return projects
      .filter((p) => selectedFilter === "all" || p.authorId === selectedFilter)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt.replace(/\//g, "-")).getTime();
        const dateB = new Date(b.createdAt.replace(/\//g, "-")).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [projects, selectedFilter, sortOrder]);

  const paginatedProjects = useMemo(() => {
    if (viewMode === "grid") return filteredProjects;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, viewMode, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProjects.length / itemsPerPage);
  }, [filteredProjects.length, itemsPerPage]);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
    setCurrentPage(1);
  }, []);

  const selectFilter = useCallback((filterId: string) => {
    setSelectedFilter(filterId);
    setShowFilterDropdown(false);
  }, []);

  const selectSort = useCallback((value: SortOrder) => {
    setSortOrder(value);
    setShowSortDropdown(false);
  }, []);

  const toggleContextMenu = useCallback((projectId: string) => {
    setOpenContextMenuId((prev) => (prev === projectId ? null : projectId));
  }, []);

  const closeContextMenu = useCallback(() => {
    setOpenContextMenuId(null);
  }, []);

  const handleContextAction = useCallback((projectId: string, action: string) => {
    console.log(`Action: ${action} for project: ${projectId}`);
    setOpenContextMenuId(null);
  }, []);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const toggleFilterDropdown = useCallback(() => {
    setShowFilterDropdown((prev) => !prev);
  }, []);

  const toggleSortDropdown = useCallback(() => {
    setShowSortDropdown((prev) => !prev);
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
    currentPage,
    totalPages,
    filteredProjects,
    paginatedProjects,
    filterRef,
    sortRef,
    filterOptions,
    sortOptions,
    toggleViewMode,
    selectFilter,
    selectSort,
    toggleContextMenu,
    closeContextMenu,
    handleContextAction,
    changePage,
    toggleFilterDropdown,
    toggleSortDropdown,
  };
}
