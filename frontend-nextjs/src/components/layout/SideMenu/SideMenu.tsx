"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSideMenu } from "@/contexts/SideMenuContext";
import { useProjects } from "@/contexts/ProjectContext";
import { Project } from "@/types";
import styles from "./SideMenu.module.scss";

// Animation variants - width values must match _tokens.scss
const SIDEBAR_WIDTH = 197; // $sidebar-width in _tokens.scss
const SIDEBAR_COLLAPSED_WIDTH = 50; // $sidebar-collapsed-width in _tokens.scss

const sidebarVariants = {
  expanded: {
    width: SIDEBAR_WIDTH,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  collapsed: {
    width: SIDEBAR_COLLAPSED_WIDTH,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const textVariants = {
  visible: {
    opacity: 1,
    x: 0,
    display: "inline",
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  hidden: {
    opacity: 0,
    x: -10,
    transitionEnd: {
      display: "none",
    },
    transition: {
      duration: 0.15,
    },
  },
};

const menuItemVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  hidden: {
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.15,
    },
  },
};

const toggleIconVariants = {
  expanded: { rotate: 0 },
  collapsed: { rotate: 180 },
};

interface SideMenuProps {
  onProjectSelected?: (project: Project) => void;
}

export function SideMenu({ onProjectSelected }: SideMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSideMenu();
  const { projects, selectProject } = useProjects();

  const isArchiveActive = pathname.includes("/buyer/archive");
  const isMyPageActive = pathname.includes("/buyer/my-page");
  const isUserListActive = pathname.includes("/buyer/user-list");

  const handleToggleMenu = () => {
    toggle();
  };

  const handleSelectProject = (project: Project) => {
    selectProject(project.id);
    onProjectSelected?.(project);
  };

  const navigateToNewProject = () => {
    router.push("/buyer");
  };

  const navigateToArchive = () => {
    router.push("/buyer/archive");
  };

  const navigateToMyPage = () => {
    router.push("/buyer/my-page");
  };

  const navigateToUserList = () => {
    router.push("/buyer/user-list");
  };

  return (
    <motion.aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      initial={false}
    >
      {/* Top Section (Frame 14) */}
      <div className={styles.topSection}>
        {/* Menu Toggle */}
        <div className={`${styles.menuToggle} ${isCollapsed ? styles.centered : ""}`}>
          <motion.button
            className={styles.toggleButton}
            onClick={handleToggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              variants={toggleIconVariants}
              animate={isCollapsed ? "collapsed" : "expanded"}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/icons/menu-toggle.svg"
                alt="Menu"
                width={20}
                height={13}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* New Project Button */}
        <div className={styles.newProjectWrapper}>
          <motion.button
            className={`${styles.newProjectButton} ${isCollapsed ? styles.centered : ""}`}
            onClick={navigateToNewProject}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.plusIcon}>
              <Image src="/icons/plus.svg" alt="Plus" width={10} height={10} />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  className={styles.newProjectText}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  新規プロジェクト作成
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Separator Line */}
        <div className={styles.separator} />

        {/* RFP Section */}
        <div className={`${styles.section} ${isCollapsed ? styles.centered : ""}`}>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <span className={styles.sectionLabel}>RFP</span>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            className={`${styles.archiveMenuItem} ${isCollapsed ? styles.centered : ""} ${isArchiveActive ? styles.active : ""}`}
            onClick={navigateToArchive}
            whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src="/icons/folder.svg"
              alt="Archive"
              width={22}
              height={22}
            />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  className={styles.menuItemText}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  アーカイブ
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* PROJECT Section */}
        <div className={`${styles.projectSection} ${isCollapsed ? styles.centered : ""}`}>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <span className={styles.sectionLabel}>PROJECT</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          <motion.div
            className={`${styles.searchItem} ${isCollapsed ? styles.centered : ""}`}
            whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src="/icons/search.svg"
              alt="Search"
              width={20}
              height={20}
            />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  className={styles.menuItemText}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  プロジェクト検索
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Project List */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                className={styles.projectList}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className={`${styles.projectItem} ${project.isSelected ? styles.selected : ""}`}
                    onClick={() => handleSelectProject(project)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={
                        project.isSelected
                          ? "/icons/project-active.svg"
                          : "/icons/project.svg"
                      }
                      alt="Project"
                      width={10}
                      height={12}
                      className={styles.projectIcon}
                    />
                    <span
                      className={`${styles.projectName} ${project.isSelected ? styles.selected : ""}`}
                    >
                      {project.name}
                    </span>
                    {project.isSelected && (
                      <Image
                        src="/icons/more-dots.svg"
                        alt="More"
                        width={16}
                        height={16}
                        className={styles.moreIcon}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Section (Frame 15) */}
      <div className={`${styles.bottomSection} ${isCollapsed ? styles.centered : ""}`}>
        {/* User List */}
        <motion.div
          className={`${styles.userListItem} ${isCollapsed ? styles.centered : ""} ${isUserListActive ? styles.active : ""}`}
          onClick={navigateToUserList}
          whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 3 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="16"
            viewBox="0 0 23 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.475 8C9.69852 8 11.5 6.20971 11.5 4C11.5 1.79029 9.69852 0 7.475 0C5.25147 0 3.45 1.79029 3.45 4C3.45 6.20971 5.25147 8 7.475 8ZM10.35 4C10.35 5.57886 9.06372 6.85714 7.475 6.85714C5.88627 6.85714 4.6 5.57886 4.6 4C4.6 2.42114 5.88627 1.14286 7.475 1.14286C9.06372 1.14286 10.35 2.42114 10.35 4ZM0 16V12.8C0 10.368 4.98007 9.14286 7.475 9.14286C9.13445 9.14286 11.8939 9.68514 13.5556 10.764C14.7401 10.4457 16.039 10.2857 16.9625 10.2857C18.0308 10.2857 19.4643 10.4994 20.6482 10.9314C21.2382 11.1474 21.8034 11.4309 22.2306 11.7977C22.6613 12.1674 23 12.6674 23 13.2949V16H0ZM1.15 12.8C1.15 12.6189 1.23395 12.3709 1.59045 12.0486C1.95442 11.7194 2.51447 11.4006 3.22345 11.1229C4.64427 10.5657 6.36928 10.2857 7.475 10.2857C8.58072 10.2857 10.3063 10.5657 11.726 11.1229C12.4355 11.4006 12.9956 11.7194 13.359 12.0486C13.716 12.3709 13.8 12.6189 13.8 12.8V14.8571H1.15V12.8ZM14.578 11.6971C15.448 11.5183 16.3202 11.4286 16.9625 11.4286C17.9095 11.4286 19.2067 11.6229 20.2515 12.0046C20.7742 12.1954 21.1968 12.4206 21.4791 12.6629C21.758 12.9023 21.85 13.1126 21.85 13.2954V14.8571H14.95V12.8C14.95 12.4 14.8149 12.0314 14.578 11.6971ZM20.125 6C20.125 7.73657 18.7099 9.14286 16.9625 9.14286C16.1238 9.14286 15.3194 8.81174 14.7263 8.22234C14.1332 7.63294 13.8 6.83354 13.8 6C13.8 4.26343 15.2151 2.85714 16.9625 2.85714C18.7099 2.85714 20.125 4.26343 20.125 6ZM16.9625 8C18.0745 8 18.975 7.10514 18.975 6C18.975 4.89486 18.0745 4 16.9625 4C16.4288 4 15.9169 4.21071 15.5394 4.58579C15.162 4.96086 14.95 5.46957 14.95 6C14.95 7.10514 15.8504 8 16.9625 8Z"
              fill="#333333"
            />
          </svg>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                className={`${styles.userListText} ${isUserListActive ? styles.active : ""}`}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                ユーザ一覧
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* User Profile */}
        <motion.div
          className={`${styles.userProfileItem} ${isCollapsed ? styles.centered : ""} ${isMyPageActive ? styles.active : ""}`}
          onClick={navigateToMyPage}
          whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 3 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className={styles.avatar}
            whileHover={{ scale: 1.1 }}
          >
            <span className={styles.avatarText}>TY</span>
          </motion.div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                className={`${styles.userName} ${isMyPageActive ? styles.active : ""}`}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                山田 太郎
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
}
