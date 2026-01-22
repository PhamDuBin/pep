"use client";

import { useState, useMemo, useCallback, useEffect, ReactNode } from "react";
import { LINES_PER_PAGE } from "@/shared/constants";

interface PaginationProps<T> {
  items: T[];
  maxVisiblePages?: number;
  children: (paginatedItems: T[], currentPage: number) => ReactNode;
}

export function Pagination<T>({
  items,
  maxVisiblePages = 5,
  children,
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / LINES_PER_PAGE);
  }, [items.length]);

  // Auto-adjust if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset to page 1 when items change significantly
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * LINES_PER_PAGE;
    return items.slice(startIndex, startIndex + LINES_PER_PAGE);
  }, [items, currentPage]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

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
        setCurrentPage(page);
      }
    },
    [currentPage, totalPages]
  );

  const handleFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const handleLastPage = useCallback(() => {
    handlePageChange(totalPages);
  }, [handlePageChange, totalPages]);

  return (
    <>
      {children(paginatedItems, currentPage)}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-0">
          {/* First Page Button */}
          <button
            className="flex items-center justify-center px-[8px] py-[4px] min-w-[24px] bg-[#f5f5f5] border border-[#f5f5f4] font-noto font-normal text-[12px] leading-[16px] text-[#1f2937] cursor-pointer transition-[background-color] duration-200 first:rounded-l-[8px] last:rounded-r-[8px] hover:not-disabled:not-[.active]:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed"
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
              className={`flex items-center justify-center px-[8px] py-[4px] min-w-[24px] bg-[#f5f5f5] border border-[#f5f5f4] font-noto font-normal text-[12px] leading-[16px] text-[#1f2937] cursor-pointer transition-[background-color] duration-200 first:rounded-l-[8px] last:rounded-r-[8px] hover:not-disabled:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed ${
                page === currentPage
                  ? "bg-[#dddddc] border-[#dddddc] hover:bg-[#dddddc]"
                  : ""
              }`}
              onClick={() => handlePageChange(page)}
              type="button"
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {/* Last Page Button */}
          <button
            className="flex items-center justify-center px-[8px] py-[4px] min-w-[24px] bg-[#f5f5f5] border border-[#f5f5f4] font-noto font-normal text-[12px] leading-[16px] text-[#1f2937] cursor-pointer transition-[background-color] duration-200 first:rounded-l-[8px] last:rounded-r-[8px] hover:not-disabled:not-[.active]:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={handleLastPage}
            type="button"
            aria-label="Last page"
          >
            &raquo;
          </button>
        </div>
      )}
    </>
  );
}
