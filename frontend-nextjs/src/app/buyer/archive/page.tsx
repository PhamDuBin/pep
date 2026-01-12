"use client";

import { useState, useCallback } from "react";
import {
  MOCK_ARCHIVE_PROJECTS,
  PROJECT_FILTER_OPTIONS,
  SORT_OPTIONS,
} from "@/mocks";
import { ArchiveProject } from "@/types";
import styles from "./page.module.scss";

export default function ArchivePage() {
  const [projects, setProjects] =
    useState<ArchiveProject[]>(MOCK_ARCHIVE_PROJECTS);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleToggleFavorite = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  }, []);

  const filteredProjects = projects
    .filter((p) => selectedFilter === "all" || p.authorId === selectedFilter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt.replace(/\//g, "-")).getTime();
      const dateB = new Date(b.createdAt.replace(/\//g, "-")).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>RFPアーカイブ</h1>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {PROJECT_FILTER_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "asc" | "desc")
            }
            className={styles.sortSelect}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.viewToggle}>
          <button
            type="button"
            className={viewMode === "grid" ? styles.active : ""}
            onClick={() => setViewMode("grid")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            type="button"
            className={viewMode === "list" ? styles.active : ""}
            onClick={() => setViewMode("list")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project Grid/List */}
      <div
        className={viewMode === "grid" ? styles.projectGrid : styles.projectList}
      >
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <span className={styles.projectName}>{project.name}</span>
                <button
                  type="button"
                  className={`${styles.favoriteBtn} ${
                    project.isFavorite ? styles.favorited : ""
                  }`}
                  onClick={() => handleToggleFavorite(project.id)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={project.isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </button>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.author}>{project.authorName}</span>
                <span className={styles.date}>{project.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
