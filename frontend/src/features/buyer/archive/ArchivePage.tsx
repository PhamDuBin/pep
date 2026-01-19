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
import Image from "next/image";

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
    toggleFavorite,
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
                  <Image
                    src="/assets/icons/teenyicons-down-solid.svg"
                    alt="Arrow Down"
                    width={10}
                    height={10}
                  />
                </button>

                <AnimatedDropdown isOpen={showFilterDropdown}>
                  <div className="absolute top-[calc(100%+4px)] left-0 flex flex-col gap-[8px] py-[14px] px-[20px] bg-[#ffffff] border border-[#cfcfcf] rounded-[4px] z-[200] shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[180px]">
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
                          <Image
                            src="/assets/icons/material-symbols-check-rounded.svg"
                            alt="Checkmark"
                            width={13}
                            height={13}
                          />
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
                  <Image
                    src="/assets/icons/teenyicons-down-solid.svg"
                    alt="Arrow Down"
                    width={10}
                    height={10}
                  />
                </button>

                <AnimatedDropdown isOpen={showSortDropdown}>
                  <div className="absolute top-[calc(100%+4px)] left-0 flex flex-col gap-[8px] py-[14px] px-[20px] bg-[#ffffff] border border-[#cfcfcf] rounded-[4px] z-[200] shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[100px]">
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
                          <Image
                            src="/assets/icons/material-symbols-check-rounded.svg"
                            alt="Checkmark"
                            width={13}
                            height={13}
                          />
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
                <Image
                  src="/assets/icons/group.svg"
                  alt="Grid View"
                  width={23}
                  height={21}
                />
              ) : (
                <Image
                  src="/assets/icons/vector.svg"
                  alt="Group View"
                  width={22}
                  height={21}
                />
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
                            <Image
                              src="/assets/icons/pencil-archive.svg"
                              alt="Pencil Icon"
                              width={11}
                              height={11}
                            />
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
                            className={`cursor-pointer transition-all duration-200 hover:scale-110 ${
                              project.isFavorite
                                ? "opacity-100"
                                : "opacity-0 group-hover/card:opacity-100"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(project.id);
                            }}
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
                            <div className="flex-1 flex items-center gap-[5px] min-w-0">
                              <Image
                                src="/assets/icons/pencil-archive.svg"
                                alt="Pencil Icon"
                                width={11}
                                height={11}
                              />
                              <span className="font-normal text-[12px] text-[#808080] overflow-hidden text-ellipsis whitespace-nowrap">
                                {project.authorName}
                              </span>
                            </div>
                            <div className="flex items-center justify-center w-[150px] px-[12px] flex-shrink-0">
                              <span className="font-normal text-[12px] text-[#808080]">
                                {project.createdAt}
                              </span>
                            </div>
                          </div>
                          {/* Favorite star */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="cursor-pointer transition-all duration-200 hover:scale-110 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(project.id);
                            }}
                          >
                            <path
                              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z"
                              fill={project.isFavorite ? "#066A9E" : "#b9b9b9"}
                            />
                          </svg>
                          <button
                            className="flex items-center justify-center w-[36.5px] h-[20.5px] p-0 bg-transparent border-none cursor-pointer flex-shrink-0 hover:opacity-70"
                            onClick={() => toggleContextMenu(project.id)}
                            type="button"
                          >
                            <Image
                              src="/assets/icons/dots-black.svg"
                              alt="More Options"
                              width={12}
                              height={2}
                            />
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
