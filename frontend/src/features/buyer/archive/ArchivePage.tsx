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
import { getProjectColor } from "./constants/project-colors.constants";
import { ProjectPlanModal } from "./components";
import { ArchiveProject } from "./models";
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
    filteredProjects,
    filterRef,
    sortRef,
    filterOptions,
    sortOptions,
    showPlanModal,
    selectedProject,
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
  } = useArchive();

  const renderGridView = (paginatedProjects: ArchiveProject[], currentPage: number) => (
    <AnimatedList
      key={`grid-${currentPage}`}
      className="flex flex-wrap gap-[25px]"
      staggerDelay={0.03}
    >
      {paginatedProjects.map((project) => (
        <AnimatedListItem
          key={project.id}
          className={`relative ${openContextMenuId === project.id ? "z-[50]" : "z-0"}`}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-[5px] w-[220px] flex-shrink-0 group/card">
              <div
                className="flex items-center justify-start p-[15px] h-[100px] rounded-[12px] box-border transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer"
                style={{ backgroundColor: getProjectColor(project.id) }}
                onClick={() => handleProjectClick(project.id)}
              >
                <p className="font-bold text-[16px] leading-[22px] text-[#ffffff] overflow-hidden text-ellipsis line-clamp-2 break-words m-0 text-left">
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
                      handleFavoriteToggle(project.id);
                    }}
                  >
                    <path
                      d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z"
                      fill={project.isFavorite ? "#066A9E" : "#b9b9b9"}
                    />
                  </svg>
                  <button
                    className="flex items-center justify-center w-[20px] h-[20px] p-0 bg-transparent border-none cursor-pointer flex-shrink-0 hover:opacity-70"
                    onClick={() => handleContextMenuToggle(project.id)}
                    type="button"
                  >
                    <Image
                      src="/assets/icons/dots.svg"
                      alt="Menu"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {openContextMenuId === project.id && (
                <>
                  <div
                    className="fixed top-0 left-0 right-0 bottom-0 z-[99]"
                    onClick={handleContextMenuClose}
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
                        onClick={() => handleContextAction(project.id, item.action)}
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
  );

  const renderListView = (paginatedProjects: ArchiveProject[], currentPage: number) => (
    <div className="flex flex-col gap-[0px]">
      <div className="flex items-center gap-[25px] py-[10px] px-[0px] border-b border-[#C3C3C3] h-[40.5px]">
        <span className="flex-1 font-normal text-[14px] text-[#333333]">
          プロジェクト名
        </span>
        <div className="flex-1 flex items-center gap-[25px]">
          <div className="flex-1 flex items-center gap-[5px] pl-[10px]">
            <span className="font-normal text-[12px] text-[#333333]">
              作成者
            </span>
          </div>
          <div className="w-[150px] flex items-center justify-center">
            <span className="font-normal text-[12px] text-[#333333]">
              作成日
            </span>
          </div>
        </div>
        <div className="w-[36.5px]"></div>
      </div>

      <AnimatedList
        key={`list-${currentPage}`}
        className="flex flex-col gap-[0px]"
        staggerDelay={0.05}
      >
        {paginatedProjects.map((project) => (
          <AnimatedListItem
            key={project.id}
            className={`relative ${openContextMenuId === project.id ? "z-[50]" : "z-0"}`}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-[25px] py-[10px] px-[0px] border-b border-[#CFCFCF] h-[40.5px]">
                <div
                  className="flex-1 flex items-center px-[10px] py-[0px] rounded-[12px] font-bold text-[14px] text-[#333333] cursor-pointer hover:opacity-80"
                  onClick={() => handleProjectClick(project.id)}
                >
                  {project.name}
                </div>
                <div className="flex-1 flex items-center gap-[25px]">
                  <div className="flex-1 flex items-center gap-[5px]">
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
                  <div className="w-[150px] flex items-center justify-center px-[12px]">
                    <span className="font-normal text-[12px] text-[#808080]">
                      {project.createdAt}
                    </span>
                  </div>
                </div>
                <div className="w-[36.5px] flex items-center justify-center py-[9px] px-[12px]">
                  <button
                    className="flex items-center justify-center w-[12.5px] h-[2.5px] p-0 bg-transparent border-none cursor-pointer hover:opacity-70"
                    onClick={() => handleContextMenuToggle(project.id)}
                    type="button"
                  >
                    <Image
                      src="/assets/icons/dot.svg"
                      alt="Menu"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {openContextMenuId === project.id && (
                  <>
                    <div
                      className="fixed top-0 left-0 right-0 bottom-0 z-[99]"
                      onClick={handleContextMenuClose}
                    />
                    <motion.div
                      className="absolute top-[calc(100%+5px)] right-[0px] flex flex-col gap-[8px] py-[14px] px-[20px] bg-[#ffffff] border border-[#cfcfcf] rounded-[4px] z-[150] min-w-[120px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
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
                          onClick={() => handleContextAction(project.id, item.action)}
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
    </div>
  );

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
            <Image
              src="/assets/icons/star.svg"
              alt="Favorites"
              width={24}
              height={24}
              className="cursor-pointer transition-all duration-200 hover:scale-110"
            />
            <div className="flex items-center gap-[15px]">
              <div className="relative" ref={filterRef}>
                <button
                  className="flex items-center gap-[8px] py-[7px] px-[20px] bg-white border border-[#d1d5db] rounded-[4px] cursor-pointer transition-[border-color] duration-200 hover:border-[#9ca3af]"
                  onClick={handleFilterDropdownToggle}
                  type="button"
                >
                  <span className="font-normal text-[14px] leading-normal text-[#374151] whitespace-nowrap">
                    {selectedFilterLabel}
                  </span>
                  <Image
                    src="/assets/icons/chevron-down.svg"
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
                          option.id === selectedFilter ? "text-primary" : "text-black"
                        }`}
                        type="button"
                        onClick={() => handleFilterSelect(option.id)}
                      >
                        {option.id === selectedFilter && (
                          <Image
                            src="/assets/icons/check-rounded.svg"
                            alt="Checkmark"
                            width={13}
                            height={13}
                          />
                        )}
                        <span
                          className={option.id === selectedFilter ? "text-primary" : ""}
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
                  onClick={handleSortDropdownToggle}
                  type="button"
                >
                  <span className="font-normal text-[14px] leading-normal text-[#374151] whitespace-nowrap">
                    作成日
                  </span>
                  <Image
                    src="/assets/icons/chevron-down.svg"
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
                          option.value === sortOrder ? "text-primary" : "text-black"
                        }`}
                        type="button"
                        onClick={() => handleSortSelect(option.value)}
                      >
                        {option.value === sortOrder && (
                          <Image
                            src="/assets/icons/check-rounded.svg"
                            alt="Checkmark"
                            width={13}
                            height={13}
                          />
                        )}
                        <span
                          className={option.value === sortOrder ? "text-primary" : ""}
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
              onClick={handleViewModeToggle}
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
          ) : (
            <div className="flex flex-col gap-[25px] w-full justify-between min-h-[calc(100vh-300px)]">
              <Pagination items={filteredProjects}>
                {(paginatedProjects, currentPage) =>
                  viewMode === "grid"
                    ? renderGridView(paginatedProjects, currentPage)
                    : renderListView(paginatedProjects, currentPage)
                }
              </Pagination>
              <div className="flex items-center justify-center">
                <button
                  className="flex items-center justify-center h-[33px] px-[15px] py-[7px] bg-white border border-[#808080] rounded-[8px] font-normal text-[14px] leading-[19px] text-[#333333] cursor-pointer transition-all duration-150 hover:bg-[#f9f9f9] hover:border-[#066A9E]"
                  type="button"
                >
                  もっと表示
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Project Plan Modal */}
        <ProjectPlanModal
          isOpen={showPlanModal}
          onClose={handlePlanModalClose}
          project={selectedProject}
        />
      </div>
    </PageTransition>
  );
}
