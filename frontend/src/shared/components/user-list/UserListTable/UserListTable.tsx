"use client";

import { UserListItem } from "@/shared/types/user-list";

// =============================================================================
// USER LIST TABLE COMPONENT
// =============================================================================

interface UserListTableProps {
  users: UserListItem[];
  isAllSelected: boolean;
  onToggleAllSelection: () => void;
  onToggleSelection: (userId: string) => void;
  onChangeClick: (userId: string) => void;
  getPermissionLabel?: (permission: string) => string;
  onRowClick?: (userId: string) => void;
}

export function UserListTable({
  users,
  isAllSelected,
  onToggleAllSelection,
  onToggleSelection,
  onChangeClick,
  getPermissionLabel,
  onRowClick,
}: UserListTableProps) {
  return (
    <div className="w-full overflow-x-auto border border-[#d4d4d4] rounded-[5px]">
      <table className="w-full border-collapse bg-white border border-[#d4d4d4] rounded-[4px] overflow-hidden min-w-[600px]">
        <thead>
          <tr className="bg-[#f5f5f5]">
            <th className="w-[44px] px-[12px] py-[10px] text-center align-middle border-l border-[#cfcfcf] border-t border-t-[#d4d4d4] font-inter font-semibold text-[14px] leading-[1.3] text-black">
              <label className="relative inline-flex items-center justify-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleAllSelection}
                  className="absolute opacity-0 cursor-pointer h-0 w-0"
                />
                <span
                  className={`w-[20px] h-[20px] border rounded-[4px] flex items-center justify-center transition-all duration-200 ${
                    isAllSelected
                      ? "border-[#066a9e]"
                      : "bg-[#ffffff] border-[#cfcfcf]"
                  }`}
                  style={{
                    backgroundColor: isAllSelected ? "#066a9e" : "#ffffff",
                  }}
                >
                  {isAllSelected && (
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5L4.5 8.5L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </label>
            </th>
            <th className="px-[12px] py-[15px] font-inter font-bold text-[16px] leading-[1.3] text-black text-center border-t border-t-[#d4d4d4]">
              ユーザー
            </th>
            <th className="w-[120px] px-[12px] py-[15px] text-center border-t border-t-[#d4d4d4] font-inter font-semibold text-[14px] leading-[1.3] text-black">
              権限
            </th>
            <th className="px-[12px] py-[10px] text-center border-t border-t-[#d4d4d4] font-inter font-semibold text-[14px] leading-[1.3] text-black" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={`border-t border-t-[#d4d4d4] hover:bg-[#fafafa] ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick?.(user.id)}
            >
              <td className="w-[44px] px-[12px] py-[10px] text-center align-middle border-l border-[#cfcfcf]">
                <label className="relative inline-flex items-center justify-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user.isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleSelection(user.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute opacity-0 cursor-pointer h-0 w-0"
                  />
                  <span
                    className={`w-[20px] h-[20px] border rounded-[4px] flex items-center justify-center transition-all duration-200 ${
                      user.isSelected
                        ? "border-[#066a9e]"
                        : "bg-[#ffffff] border-[#cfcfcf]"
                    }`}
                    style={{
                      backgroundColor: user.isSelected ? "#066a9e" : "#ffffff",
                    }}
                  >
                    {user.isSelected && (
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 12 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5L4.5 8.5L11 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </td>
              <td className="px-[12px] py-[15px] text-left">
                <div className="flex items-center gap-[15px]">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-[40px] h-[40px] rounded-full flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div
                      className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: user.avatarColor }}
                    >
                      <span className="font-normal text-[13px] text-white">
                        {user.initials}
                      </span>
                    </div>
                  )}
                  <span className="font-bold text-[14px] leading-[1.3] text-black">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="w-[120px] px-[12px] py-[15px] text-center">
                <span className="font-medium text-[14px] leading-[1.3] text-black">
                  {getPermissionLabel
                    ? getPermissionLabel(user.permission)
                    : user.permission}
                </span>
              </td>
              <td className="px-[12px] py-[10px] text-center">
                <button
                  type="button"
                  className="px-[15px] py-[10px] bg-[#e1e1e1] border-none rounded-[8px] font-normal text-[14px] text-[#333333] cursor-pointer transition-colors duration-200 hover:bg-[#d0d0d0] active:bg-[#c0c0c0]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeClick(user.id);
                  }}
                >
                  変更
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
