"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useVendor } from "@/shared/contexts";
import { MOCK_VENDOR_CURRENT_USER } from "@/features/vendor/shared/mocks";

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

export function SideMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, companies, selectCompany } = useVendor();

  const isMyPageActive = pathname.includes("/vendor/my-page");
  const isUserListActive = pathname.includes("/vendor/user-list");

  const handleToggleMenu = () => {
    toggleSidebar();
  };

  const handleSelectCompany = (companyId: string) => {
    selectCompany(companyId);
    router.push("/vendor");
  };

  const handleMyPageClick = () => {
    router.push("/vendor/my-page");
  };

  const handleUserListClick = () => {
    router.push("/vendor/user-list");
  };

  return (
    <motion.aside
      className={`fixed left-0 top-[65px] bottom-0 h-[calc(100vh-65px)] bg-white flex flex-col justify-between items-start py-[15px] px-[10px] pb-[25px] z-40 transition-[width] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] shadow-[0px_4px_15px_rgba(0,0,0,0.1)] ${isCollapsed ? "w-[60px]" : "w-[172px]"
        }`}
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      initial={false}
    >
      {/* Top Section */}
      <div className="flex flex-col items-start gap-[25px] self-stretch overflow-hidden">
        {/* Menu Toggle */}
        <div
          className={`flex flex-col gap-[3px] w-full items-end px-[10px] ${isCollapsed ? "items-center" : ""
            }`}
        >
          <motion.button
            className="bg-transparent border-none p-0 cursor-pointer transition-opacity duration-200 hover:opacity-70"
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
                src="/assets/icons/arrow-left.svg"
                alt="Menu"
                width={20}
                height={13}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* COMPANY Section */}
        <div
          className={`flex flex-col gap-[5px] w-full ${isCollapsed ? "items-center" : ""
            }`}
        >
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <span className="text-[14px] text-[#333333] font-normal leading-[19px] px-[10px]">
                  COMPANY
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Company Search */}
          <motion.div
            className={`flex items-center gap-[7px] py-[5px] px-[10px] h-[34px] cursor-pointer rounded transition-colors duration-200 mx-[-10px] w-[calc(100%+20px)] hover:bg-[#f9fafb] ${isCollapsed ? "justify-center mx-0 px-[5px] w-full" : ""
              }`}
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
                  className="text-[13px] text-[#333333]"
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
                className="flex flex-col items-start gap-[5px] w-full"
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {companies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    className={`flex items-center py-[5px] px-[10px] min-h-[29px] rounded cursor-pointer transition-colors duration-200 mx-[-10px] w-[calc(100%+20px)] ${company.isSelected
                        ? "bg-[#e6f3f5]"
                        : "hover:bg-[#f9fafb]"
                      }`}
                    onClick={() => handleSelectCompany(company.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className={`text-[14px] font-normal leading-[19px] break-words ${company.isSelected ? "text-[#066a9e]" : "text-[#333333]"
                        }`}
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
        className={`flex flex-col justify-center gap-[10px] w-full self-stretch ${isCollapsed ? "items-center" : ""
          }`}
      >
        {/* User List */}
        <motion.div
          className={`flex items-center py-[8px] px-[10px] h-[32px] cursor-pointer rounded transition-colors duration-200 gap-[7px] mx-[-10px] w-[calc(100%+20px)] ${isUserListActive ? "bg-[#f0f0f0]" : "hover:bg-[#f9fafb]"
            } ${isCollapsed ? "justify-center mx-0 w-full px-[5px]" : ""}`}
          onClick={handleUserListClick}
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
                className={`text-[13px] ${isUserListActive ? "text-[#066a9e]" : "text-[#333333]"
                  }`}
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
          className={`flex items-center py-[5px] px-[10px] h-[40px] cursor-pointer rounded transition-colors duration-200 gap-[7px] mx-[-10px] w-[calc(100%+20px)] ${isMyPageActive ? "bg-[#f0f0f0]" : "hover:bg-[#f9fafb]"
            } ${isCollapsed ? "justify-center mx-0 w-full px-[5px]" : ""}`}
          onClick={handleMyPageClick}
          whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 3 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-[30px] h-[30px] bg-[#8ec5d0] rounded-full flex items-center justify-center flex-shrink-0"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-[13px] text-white">
              {MOCK_VENDOR_CURRENT_USER.initials}
            </span>
          </motion.div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                className={`text-[13px] ${isMyPageActive ? "text-[#066a9e]" : "text-[#333333]"
                  }`}
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
