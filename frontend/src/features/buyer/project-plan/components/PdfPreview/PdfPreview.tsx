"use client";

import { PdfPage } from "../../types";
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
        <h3 className={styles.title}>PDFページプレビュー</h3>
        <span className={styles.progress}>完了({completedCount}/{totalCount})</span>
      </div>

      {/* Page Thumbnails */}
      <div className={styles.thumbnailList}>
        {pages.map((page) => (
          <div key={page.id} className={styles.thumbnailItem}>
            {/* Thumbnail */}
            <div className={styles.thumbnailOuter}>
              <div className={styles.thumbnailInner}>
                <span className={styles.pdfText}>PDF</span>
              </div>
            </div>
            {/* Page Title */}
            <span className={styles.pageTitle}>{page.title}</span>
            <span className={styles.pageNumber}>Page{page.pageNumber}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.downloadBtn}
          onClick={onDownload}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12L3 7H6V2H10V7H13L8 12Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 14H14" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>プロジェクト計画書をダウンロード</span>
        </button>

        <button
          type="button"
          className={styles.confirmBtn}
          onClick={onConfirm}
        >
          確認
        </button>
      </div>
    </div>
  );
}
