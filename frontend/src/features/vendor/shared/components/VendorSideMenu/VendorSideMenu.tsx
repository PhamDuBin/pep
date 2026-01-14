"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useVendor } from "@/shared/contexts";
import { MOCK_VENDOR_CURRENT_USER } from "@/features/vendor/shared/mocks";
import styles from "./VendorSideMenu.module.scss";

export function VendorSideMenu() {
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

  const navigateToMyPage = () => {
    router.push("/vendor/my-page");
  };

  const navigateToUserList = () => {
    router.push("/vendor/user-list");
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : styles.expanded}`}
    >
      {/* Top Section */}
      <div className={styles.topSection}>
        {/* Menu Toggle */}
        <div className={`${styles.menuToggle} ${isCollapsed ? styles.centered : ""}`}>
          <button className={styles.toggleButton} onClick={handleToggleMenu}>
            <Image
              src="/icons/menu-toggle.svg"
              alt="Menu"
              width={20}
              height={13}
            />
          </button>
        </div>

        {/* COMPANY Section - Expanded */}
        {!isCollapsed && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>COMPANY</span>

            {/* Company Search */}
            <div className={styles.searchItem}>
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={24}
                height={24}
              />
              <span className={styles.menuItemText}>会社検索</span>
            </div>

            {/* Company List */}
            <div className={styles.companyList}>
              {companies.map((company) => (
                <div
                  key={company.id}
                  className={`${styles.companyItem} ${company.isSelected ? styles.selected : ""}`}
                  onClick={() => handleSelectCompany(company.id)}
                >
                  <span
                    className={`${styles.companyName} ${company.isSelected ? styles.selected : ""}`}
                  >
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPANY Section - Collapsed */}
        {isCollapsed && (
          <div className={`${styles.section} ${styles.centered}`}>
            <div className={`${styles.searchItem} ${styles.centered}`}>
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={24}
                height={24}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className={`${styles.bottomSection} ${isCollapsed ? styles.centered : ""}`}>
        {/* User List */}
        <div
          className={`${styles.userListItem} ${isCollapsed ? styles.centered : ""} ${isUserListActive ? styles.active : ""}`}
          onClick={navigateToUserList}
        >
          <Image
            src="/icons/users.svg"
            alt="Users"
            width={29}
            height={16}
          />
          {!isCollapsed && (
            <span
              className={`${styles.userListText} ${isUserListActive ? styles.active : ""}`}
            >
              ユーザ一覧
            </span>
          )}
        </div>

        {/* User Profile */}
        <div
          className={`${styles.userProfileItem} ${isCollapsed ? styles.centered : ""} ${isMyPageActive ? styles.active : ""}`}
          onClick={navigateToMyPage}
        >
          <div className={styles.avatar}>
            <span className={styles.avatarText}>{MOCK_VENDOR_CURRENT_USER.initials}</span>
          </div>
          {!isCollapsed && (
            <span
              className={`${styles.userName} ${isMyPageActive ? styles.active : ""}`}
            >
              {MOCK_VENDOR_CURRENT_USER.name}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
