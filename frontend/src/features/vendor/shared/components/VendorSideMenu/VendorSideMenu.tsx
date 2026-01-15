"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useVendor } from "@/shared/contexts";
import { MOCK_VENDOR_CURRENT_USER } from "@/features/vendor/shared/mocks";
import styles from "./VendorSideMenu.module.scss";

// Animation variants - width values must match _tokens.scss
const SIDEBAR_WIDTH = 172; // $sidebar-width in _tokens.scss
const SIDEBAR_COLLAPSED_WIDTH = 60; // $sidebar-collapsed-width in _tokens.scss

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

export function VendorSideMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, companies, selectCompany } = useVendor();

  const isMyPageActive = pathname.includes("/vender/my-page");
  const isUserListActive = pathname.includes("/vender/user-list");

  const handleToggleMenu = () => {
    toggleSidebar();
  };

  const handleSelectCompany = (companyId: string) => {
    selectCompany(companyId);
    router.push("/vender");
  };

  const navigateToMyPage = () => {
    router.push("/vender/my-page");
  };

  const navigateToUserList = () => {
    router.push("/vender/user-list");
  };

  return (
    <motion.aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      initial={false}
    >
      {/* Top Section */}
      <div className={styles.topSection}>
        {/* Menu Toggle */}
        <div
          className={`${styles.menuToggle} ${isCollapsed ? styles.centered : ""}`}
        >
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
                src="/assets/icons/menu-toggle.svg"
                alt="Menu"
                width={20}
                height={13}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* COMPANY Section */}
        <div
          className={`${styles.section} ${isCollapsed ? styles.centered : ""}`}
        >
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <span className={styles.sectionLabel}>COMPANY</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Company Search */}
          <motion.div
            className={`${styles.searchItem} ${isCollapsed ? styles.centered : ""}`}
            whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src="/assets/icons/search.svg"
              alt="Search"
              width={24}
              height={24}
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
                  会社検索
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Company List */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                className={styles.companyList}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {companies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    className={`${styles.companyItem} ${company.isSelected ? styles.selected : ""}`}
                    onClick={() => handleSelectCompany(company.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className={`${styles.companyName} ${company.isSelected ? styles.selected : ""}`}
                    >
                      {company.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className={`${styles.bottomSection} ${isCollapsed ? styles.centered : ""}`}
      >
        {/* User List */}
        <motion.div
          className={`${styles.userListItem} ${isCollapsed ? styles.centered : ""} ${isUserListActive ? styles.active : ""}`}
          onClick={navigateToUserList}
          whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 3 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image
            src="/assets/icons/users.svg"
            alt="Users"
            width={29}
            height={16}
          />
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
          <motion.div className={styles.avatar} whileHover={{ scale: 1.1 }}>
            <span className={styles.avatarText}>
              {MOCK_VENDOR_CURRENT_USER.initials}
            </span>
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
                {MOCK_VENDOR_CURRENT_USER.name}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
}
