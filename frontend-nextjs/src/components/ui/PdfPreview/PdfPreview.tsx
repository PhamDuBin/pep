"use client";

import { PdfPage } from "@/types";
import styles from "./PdfPreview.module.scss";

interface PdfPreviewProps {
  pages: PdfPage[];
  completedCount?: number;
  totalCount?: number;
  onDownload?: () => void;
  onConfirm?: () => void;
}

export function PdfPreview({
  pages,
  completedCount = 5,
  totalCount = 5,
  onDownload,
  onConfirm,
}: PdfPreviewProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              stroke="#066A9E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2V8H20"
              stroke="#066A9E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.title}>プロジェクト計画書</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.progress}>
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Page Grid */}
      <div className={styles.pageGrid}>
        {pages.map((page) => (
          <div key={page.id} className={styles.pageCard}>
            <div className={styles.pageThumbnail}>
              <span className={styles.pageNumber}>{page.pageNumber}</span>
            </div>
            <span className={styles.pageTitle}>{page.title}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.downloadBtn}
          onClick={onDownload}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15V3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          ダウンロード
        </button>
        <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
          RFP作成確定
        </button>
      </div>
    </div>
  );
}
