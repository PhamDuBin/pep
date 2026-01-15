"use client";

import { useRouter } from "next/navigation";

export function ProjectPlanModeButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/buyer/project-plan");
  };

  return (
    <button
      type="button"
      className="flex items-center gap-[5px] px-[15px] py-[10px] bg-[#ffffff] border border-[#066a9e] rounded-[8px] cursor-pointer transition-[background-color] duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#e6f3f5]"
      onClick={handleClick}
    >
      <svg
        width="12"
        height="15"
        viewBox="0 0 12 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 14V1M1 1H9.5L7.5 4.5L9.5 8H1V1Z"
          stroke="#066A9E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[16px] text-[#066a9e] font-normal">
        プロジェクト計画書作成モード
      </span>
    </button>
  );
}
