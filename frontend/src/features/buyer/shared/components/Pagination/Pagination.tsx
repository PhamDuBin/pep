"use client";

import { useMemo, useCallback } from "react";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  maxVisiblePages = 5,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, totalPages, onPageChange]
  );

  const handleFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const handleLastPage = useCallback(() => {
    handlePageChange(totalPages);
  }, [handlePageChange, totalPages]);

  if (totalPages < 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      {/* First Page Button */}
      <button
        className={styles.pageBtn}
        disabled={currentPage === 1}
        onClick={handleFirstPage}
        type="button"
        aria-label="First page"
      >
        &laquo;
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`${styles.pageBtn} ${page === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(page)}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* Last Page Button */}
      <button
        className={styles.pageBtn}
        disabled={currentPage === totalPages}
        onClick={handleLastPage}
        type="button"
        aria-label="Last page"
      >
        &raquo;
      </button>
    </div>
  );
}
