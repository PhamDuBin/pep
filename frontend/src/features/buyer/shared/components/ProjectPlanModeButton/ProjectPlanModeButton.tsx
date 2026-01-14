"use client";

import { useRouter } from "next/navigation";
import styles from "./ProjectPlanModeButton.module.scss";

export function ProjectPlanModeButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/buyer/project-plan");
  };

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
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
      <span className={styles.label}>プロジェクト計画書作成モード</span>
    </button>
  );
}
