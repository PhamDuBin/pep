"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Loading,
  Pagination,
  AnimatedDropdown,
  AnimatedList,
  AnimatedListItem,
  PageTransition,
} from "@/shared/components";
import { useArchive } from "./hooks";
import { MENU_ITEMS } from "./constants/menu.constants";
import { ProjectPlanModal } from "./components";

export function ArchivePage() {
  const {
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
    showPlanModal,
    selectedProject,
    toggleViewMode,
    selectFilter,
    selectSort,
    toggleContextMenu,
    closeContextMenu,
    handleContextAction,
    handleProjectClick,
    closePlanModal,
    changePage,
    toggleFilterDropdown,
    toggleSortDropdown,
  } = useArchive();

  return (
    <PageTransition>
      <div className="flex flex-col gap-[25px] w-full py-[25px] px-[50px]">
        <div className="flex items-center pb-[10px] border-b border-[#cfcfcf]">
          <h1 className="font-bold text-[20px] leading-normal text-[#333333] m-0">
            アーカイブ
          </h1>
        </div>

        <div className="flex flex-col gap-[15px]">
          <div className="flex items-center justify-end gap-[15px]">
            <div className="flex items-center gap-[15px]">
              <div className="relative" ref={filterRef}>
                <button
                  className="flex items-center gap-[8px] py-[7px] px-[20px] bg-white border border-[#d1d5db] rounded-[4px] cursor-pointer transition-[border-color] duration-200 hover:border-[#9ca3af]"
                  onClick={toggleFilterDropdown}
                  type="button"
                >
                  <span className="font-normal text-[14px] leading-normal text-[#374151] whitespace-nowrap">
                    {selectedFilterLabel}
                  </span>
                  <svg
                    className={`flex-shrink-0 transition-transform duration-150 ${
                      showFilterDropdown ? "rotate-180" : ""
                    }`}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M2 3.5L5 6.5L8 3.5"
                      stroke="#374151"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <AnimatedDropdown isOpen={showFilterDropdown}>
                  <div className="absolute top-[calc(100%+4px)] left-0 flex flex-col gap-[8px] py-[14px] px-[20px] bg-[#ffffff] border border-[#cfcfcf] rounded-[4px] z-[200] min-w-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[180px]">
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`flex items-center gap-[5px] py-[6px] bg-[#ffffff] hover:bg-[#f5f5f5] border-none font-normal text-[14px] leading-[18px] cursor-pointer text-left whitespace-nowrap transition-all duration-150 hover:text-primary hover:translate-x-[2px] ${
                          option.id === selectedFilter
                            ? "text-primary"
                            : "text-black"
                        }`}
                        type="button"
                        onClick={() => selectFilter(option.id)}
                      >
                        {option.id === selectedFilter && (
                          <svg
                            className="flex-shrink-0"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                          >
                            <path
                              d="M2.5 6.5L5.5 9.5L10.5 3.5"
                              stroke="#066a9e"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        <span
                          className={
                            option.id === selectedFilter ? "text-primary" : ""
                          }
                        >
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </AnimatedDropdown>
              </div>

              <div className="relative" ref={sortRef}>
                <button
                  className="flex items-center gap-[8px] py-[7px] px-[20px] bg-white border border-[#d1d5db] rounded-[4px] cursor-pointer transition-[border-color] duration-200 hover:border-[#9ca3af]"
                  onClick={toggleSortDropdown}
                  type="button"
                >
                  <span className="font-normal text-[14px] leading-normal text-[#374151] whitespace-nowrap">
                    作成日
                  </span>
                  <svg
                    className={`flex-shrink-0 transition-transform duration-150 ${
                      showSortDropdown ? "rotate-180" : ""
                    }`}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M2 3.5L5 6.5L8 3.5"
                      stroke="#374151"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <AnimatedDropdown isOpen={showSortDropdown}>
                  <div className="absolute top-[calc(100%+4px)] left-0 flex flex-col gap-[8px] py-[14px] px-[20px] bg-[#ffffff] border border-[#cfcfcf] rounded-[4px] z-[200] min-w-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[100px]">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`flex items-center gap-[5px] py-[6px] bg-[#ffffff] hover:bg-[#f5f5f5] border-none font-normal text-[14px] leading-[18px] cursor-pointer text-left whitespace-nowrap transition-all duration-150 hover:text-primary hover:translate-x-[2px] ${
                          option.value === sortOrder
                            ? "text-primary"
                            : "text-black"
                        }`}
                        type="button"
                        onClick={() => selectSort(option.value)}
                      >
                        {option.value === sortOrder && (
                          <svg
                            className="flex-shrink-0"
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                          >
                            <path
                              d="M2.5 6.5L5.5 9.5L10.5 3.5"
                              stroke="#066a9e"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        <span
                          className={
                            option.value === sortOrder ? "text-primary" : ""
                          }
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </AnimatedDropdown>
              </div>
            </div>

            <button
              className="flex items-center justify-center w-[24px] h-[22px] p-0 bg-transparent border-none cursor-pointer transition-all duration-150 hover:opacity-70 hover:scale-110 active:scale-95"
              onClick={toggleViewMode}
              type="button"
            >
              {viewMode === "grid" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                >
                  <path
                    d="M23.5715 10.7145H8.57153M23.5715 19.2859H8.57153M23.5715 2.14307H8.57153"
                    stroke="#066A9E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.14071 4.28571C3.21214 4.28571 4.28357 3.21429 4.28357 2.14286C4.28357 1.07143 3.21214 0 2.14071 0C1.06929 0 0 1.07143 0 2.14286C0 3.21429 1.06929 4.28571 2.14071 4.28571ZM2.14071 12.8571C3.21214 12.8571 4.28357 11.7857 4.28357 10.7143C4.28357 9.64286 3.21214 8.57143 2.14071 8.57143C1.06929 8.57143 0 9.64286 0 10.7143C0 11.7857 1.06929 12.8571 2.14071 12.8571ZM2.14071 21.4286C3.21214 21.4286 4.28357 20.3571 4.28357 19.2857C4.28357 18.2143 3.21214 17.1429 2.14071 17.1429C1.06929 17.1429 0 18.2143 0 19.2857C0 20.3571 1.06929 21.4286 2.14071 21.4286Z"
                    fill="#066A9E"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                >
                  <path
                    d="M1.375 9.1875C1.0065 9.1875 0.685208 9.05669 0.411125 8.79506C0.137041 8.53344 0 8.22675 0 7.875V1.3125C0 0.96075 0.137041 0.654062 0.411125 0.392437C0.685208 0.130812 1.0065 0 1.375 0H8.25C8.6185 0 8.93979 0.130812 9.21387 0.392437C9.48796 0.654062 9.625 0.96075 9.625 1.3125V7.875C9.625 8.22675 9.48796 8.53344 9.21387 8.79506C8.93979 9.05669 8.6185 9.1875 8.25 9.1875H1.375ZM1.375 21C1.0065 21 0.685208 20.8692 0.411125 20.6076C0.137041 20.3459 0 20.0392 0 19.6875V13.125C0 12.7732 0.137041 12.4666 0.411125 12.2049C0.685208 11.9433 1.0065 11.8125 1.375 11.8125H8.25C8.6185 11.8125 8.93979 11.9433 9.21387 12.2049C9.48796 12.4666 9.625 12.7732 9.625 13.125V19.6875C9.625 20.0392 9.48796 20.3459 9.21387 20.6076C8.93979 20.8692 8.6185 21 8.25 21H1.375ZM13.75 9.1875C13.3815 9.1875 13.0602 9.05669 12.7861 8.79506C12.512 8.53344 12.375 8.22675 12.375 7.875V1.3125C12.375 0.96075 12.512 0.654062 12.7861 0.392437C13.0602 0.130812 13.3815 0 13.75 0H20.625C20.9935 0 21.3148 0.130812 21.5889 0.392437C21.863 0.654062 22 0.96075 22 1.3125V7.875C22 8.22675 21.863 8.53344 21.5889 8.79506C21.3148 9.05669 20.9935 9.1875 20.625 9.1875H13.75ZM13.75 21C13.3815 21 13.0602 20.8692 12.7861 20.6076C12.512 20.3459 12.375 20.0392 12.375 19.6875V13.125C12.375 12.7732 12.512 12.4666 12.7861 12.2049C13.0602 11.9433 13.3815 11.8125 13.75 11.8125H20.625C20.9935 11.8125 21.3148 11.9433 21.5889 12.2049C21.863 12.4666 22 12.7732 22 13.125V19.6875C22 20.0392 21.863 20.3459 21.5889 20.6076C21.3148 20.8692 20.9935 21 20.625 21H13.75ZM1.375 7.875H8.25V1.3125H1.375V7.875ZM13.75 7.875H20.625V1.3125H13.75V7.875ZM13.75 19.6875H20.625V13.125H13.75V19.6875ZM1.375 19.6875H8.25V13.125H1.375V19.6875Z"
                    fill="#066A9E"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-[15px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loading type="spinner" size="lg" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center min-h-[200px] text-[14px] text-[#808080]">
              <p>アーカイブされたプロジェクトはありません</p>
            </div>
          ) : viewMode === "grid" ? (
            <AnimatedList
              className="flex flex-wrap gap-[25px]"
              staggerDelay={0.03}
            >
              {paginatedProjects.map((project) => (
                <AnimatedListItem
                  key={project.id}
                  // SỬA LỖI Ở ĐÂY: Thêm z-index động. Nếu menu đang mở, thẻ này sẽ có z-index cao (50), ngược lại là 0.
                  className={`relative ${
                    openContextMenuId === project.id ? "z-[50]" : "z-0"
                  }`}
                >
                  <motion.div
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col gap-[5px] w-[220px] flex-shrink-0 group/card">
                      <div
                        className="flex items-center p-[15px] h-[70px] bg-white border border-[#e1e1e1] rounded-[12px] box-border transition-all duration-300 hover:border-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <p className="font-bold text-[14px] leading-[1.4] text-[#333333] overflow-hidden text-ellipsis line-clamp-2 break-words m-0">
                          {project.name}
                        </p>
                      </div>
                      <div className="flex items-start justify-between w-full px-[2px]">
                        <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                          <div className="flex items-center gap-[5px]">
                            {/* ... (Giữ nguyên icon user) ... */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M10.7053 5.11136C10.4554 4.87204 10.1276 4.73087 9.78205 4.71376C9.43648 4.69666 9.09633 4.80476 8.82404 5.01824L7.71092 1.64886C7.61829 1.36383 7.44501 1.11176 7.21206 0.923187C6.97912 0.734611 6.69649 0.617614 6.39842 0.586365L1.03529 0.0051147C0.896289 -0.00946494 0.755783 0.00722053 0.624059 0.05395C0.492335 0.100679 0.372726 0.17627 0.273985 0.275191C0.175244 0.374111 0.0998711 0.493857 0.0533813 0.625666C0.00689155 0.757475 -0.00953832 0.898011 0.00529411 1.03699L0.586544 6.39886C0.617794 6.69694 0.73479 6.97956 0.923366 7.21251C1.11194 7.44546 1.36401 7.61874 1.64904 7.71136L5.01779 8.81761C4.81166 9.06986 4.69905 9.3856 4.69904 9.71136C4.7002 10.084 4.84873 10.441 5.1122 10.7045C5.37567 10.9679 5.73269 11.1165 6.10529 11.1176C6.4783 11.1166 6.83576 10.9681 7.09967 10.7045L10.7059 7.09886C10.9695 6.83517 11.1175 6.47761 11.1175 6.1048C11.1175 5.73199 10.9695 5.37444 10.7059 5.11074L10.7053 5.11136ZM1.84279 7.11761C1.67226 7.06121 1.52151 6.95701 1.4085 6.8174C1.29548 6.67779 1.22495 6.50866 1.20529 6.33011L0.642794 1.08636L3.14904 3.59261C3.10445 3.72356 3.09727 3.86435 3.12829 3.99916C3.15932 4.13397 3.22732 4.25746 3.32467 4.35574C3.39188 4.42584 3.47241 4.48181 3.56153 4.52037C3.65066 4.55893 3.74659 4.57931 3.8437 4.5803C3.94081 4.58129 4.03714 4.56288 4.12703 4.52615C4.21693 4.48942 4.29859 4.43511 4.36721 4.3664C4.43584 4.29769 4.49006 4.21596 4.52668 4.12602C4.5633 4.03608 4.58159 3.93973 4.58048 3.84262C4.57937 3.74552 4.55888 3.64961 4.52021 3.56053C4.48154 3.47145 4.42547 3.39099 4.35529 3.32386C4.25894 3.226 4.13636 3.15806 4.00231 3.12823C3.86825 3.09841 3.72843 3.10796 3.59967 3.15574L1.08717 0.64324L6.33092 1.20574C6.50986 1.22399 6.67959 1.29401 6.81935 1.40724C6.9591 1.52047 7.06282 1.67198 7.11779 1.84324L8.32467 5.50574L5.50592 8.32449L1.84279 7.11761ZM9.16092 5.54886C9.27057 5.44017 9.40998 5.3664 9.56152 5.33687C9.71307 5.30735 9.86997 5.32339 10.0124 5.38297C10.1548 5.44256 10.2764 5.54301 10.3618 5.67165C10.4472 5.80029 10.4926 5.95134 10.4922 6.10574C10.492 6.2081 10.4715 6.30941 10.4319 6.40381C10.3923 6.49821 10.3344 6.58384 10.2615 6.65574L6.65467 10.262C6.50603 10.4047 6.30794 10.4844 6.10186 10.4844C5.89578 10.4844 5.69769 10.4047 5.54904 10.262C5.40446 10.1154 5.3234 9.91786 5.3234 9.71199C5.3234 9.50612 5.40446 9.30854 5.54904 9.16199L9.16092 5.54886Z"
                                fill="#808080"
                              />
                            </svg>
                            <span className="font-normal text-[12px] text-[#808080] overflow-hidden text-ellipsis whitespace-nowrap">
                              {project.authorName}
                            </span>
                          </div>
                          <span className="font-normal text-[12px] text-[#808080]">
                            {project.createdAt}
                          </span>
                        </div>
                        <div className="flex items-center gap-[5px] flex-shrink-0">
                          {/* Favorite star - shows on hover or when favorited */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={`cursor-pointer transition-opacity duration-200 ${
                              project.isFavorite ? "opacity-100" : "opacity-0 group-hover/card:opacity-100"
                            }`}
                          >
                            <path
                              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z"
                              fill={project.isFavorite ? "#066A9E" : "#b9b9b9"}
                            />
                          </svg>
                          <button
                            className="flex items-center justify-center w-[20px] h-[20px] p-0 bg-transparent border-none cursor-pointer flex-shrink-0 hover:opacity-70"
                            onClick={() => toggleContextMenu(project.id)}
                            type="button"
                          >
                            <svg
                              width="16"
                              height="4"
                              viewBox="0 0 16 4"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="2" cy="2" r="1.5" fill="#808080" />
                              <circle cx="8" cy="2" r="1.5" fill="#808080" />
                              <circle cx="14" cy="2" r="1.5" fill="#808080" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {openContextMenuId === project.id && (
                        <>
                          <div
                            className="fixed top-0 left-0 right-0 bottom-0 z-[99]"
                            onClick={closeContextMenu}
                          />
                          <motion.div
                            className="absolute top-full right-0 flex flex-col gap-[8px] py-[14px] px-[20px] bg-[#ffffff] border border-[#cfcfcf] rounded-[4px] z-[100] min-w-[120px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            transition={{ duration: 0.15 }}
                          >
                            {MENU_ITEMS.map((item) => (
                              <button
                                key={item.action}
                                className="flex items-center justify-start py-[6px] bg-[#ffffff] hover:bg-[#f5f5f5] border-none font-normal text-[14px] leading-[18px] text-black cursor-pointer text-left whitespace-nowrap transition-all duration-150 hover:text-primary hover:translate-x-[2px]"
                                type="button"
                                onClick={() =>
                                  handleContextAction(project.id, item.action)
                                }
                              >
                                {item.label}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatedListItem>
              ))}
            </AnimatedList>
          ) : (
            <div className="flex flex-col gap-[25px]">
              {/* ... (Giữ nguyên phần Header của List view) ... */}
              <div className="flex items-center gap-[25px] py-[10px] border-b border-[#c3c3c3]">
                <span className="flex-1 font-normal text-[14px] text-[#333333]">
                  プロジェクト名
                </span>
                <div className="flex-1 flex items-center ml-[8px]">
                  <span className="flex-1 font-normal text-[12px] text-[#333333] ml-[12px]">
                    作成者
                  </span>
                  <span className="w-[150px] text-center font-normal text-[12px] text-[#333333]">
                    作成日
                  </span>
                  <span className="w-[36.5px]"></span>
                </div>
              </div>

              <AnimatedList
                className="flex flex-col gap-[25px]"
                staggerDelay={0.05}
              >
                {paginatedProjects.map((project) => (
                  <AnimatedListItem
                    key={project.id}
                    // SỬA LỖI Ở ĐÂY CHO LIST VIEW: Thêm z-index động tương tự
                    className={`relative ${
                      openContextMenuId === project.id ? "z-[50]" : "z-0"
                    }`}
                  >
                    <motion.div
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ scale: 1.005 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-center gap-[25px] w-full">
                        <div
                          className="flex-1 min-w-0 flex items-center p-[15px] bg-white border border-[#e1e1e1] rounded-[12px] transition-all duration-300 hover:border-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <p className="font-bold text-[14px] leading-[1.4] text-[#333333] overflow-hidden text-ellipsis whitespace-nowrap m-0">
                            {project.name}
                          </p>
                        </div>
                        <div className="flex-1 flex items-center min-w-0">
                          <div className="flex-1 flex items-center min-w-0">
                            {/* ... Tác giả ... */}
                            <div className="flex-1 flex items-center gap-[5px] min-w-0">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path d="..." fill="#808080" />
                              </svg>
                              <span className="font-normal text-[12px] text-[#808080] overflow-hidden text-ellipsis whitespace-nowrap">
                                {project.authorName}
                              </span>
                            </div>
                            {/* ... Ngày tháng ... */}
                            <div className="flex items-center justify-center w-[150px] px-[12px] flex-shrink-0">
                              <span className="font-normal text-[12px] text-[#808080]">
                                {project.createdAt}
                              </span>
                            </div>
                          </div>
                          {/* ... Nút 3 chấm ... */}
                          <button
                            className="flex items-center justify-center w-[36.5px] h-[20.5px] p-0 bg-transparent border-none cursor-pointer flex-shrink-0 hover:opacity-70"
                            onClick={() => toggleContextMenu(project.id)}
                            type="button"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <circle cx="4" cy="10" r="1.5" fill="#808080" />
                              <circle cx="10" cy="10" r="1.5" fill="#808080" />
                              <circle cx="16" cy="10" r="1.5" fill="#808080" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {openContextMenuId === project.id && (
                          <>
                            <div
                              className="fixed top-0 left-0 right-0 bottom-0 z-[99]"
                              onClick={closeContextMenu}
                            />
                            <motion.div
                              className="absolute top-[calc(100%+5px)] right-[36px] flex flex-col gap-[8px] py-[14px] px-[20px] bg-[#ffffff] border border-[#cfcfcf] rounded-[4px] z-[150] min-w-[120px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              transition={{ duration: 0.15 }}
                            >
                              {MENU_ITEMS.map((item) => (
                                <button
                                  key={item.action}
                                  className="flex items-center justify-start py-[6px] bg-[#ffffff] hover:bg-[#f5f5f5] border-none font-normal text-[14px] leading-[18px] text-black cursor-pointer text-left whitespace-nowrap transition-all duration-150 hover:text-primary hover:translate-x-[2px]"
                                  type="button"
                                  onClick={() =>
                                    handleContextAction(project.id, item.action)
                                  }
                                >
                                  {item.label}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </AnimatedListItem>
                ))}
              </AnimatedList>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={changePage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Project Plan Modal */}
      <ProjectPlanModal
        isOpen={showPlanModal}
        onClose={closePlanModal}
        project={selectedProject}
      />
    </PageTransition>
  );
}
