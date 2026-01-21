"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <Image
        src="/assets/icons/project-active.svg"
        alt="Project Plan"
        width={12}
        height={15}
      />
      <span className="text-[16px] text-[#066a9e] font-normal">
        プロジェクト計画書作成モード
      </span>
    </button>
  );
}
