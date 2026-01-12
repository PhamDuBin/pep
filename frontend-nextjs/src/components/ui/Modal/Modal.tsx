"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import styles from "./Modal.module.scss";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  isLoading?: boolean;
  customClass?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const sizeClassMap: Record<ModalSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = "md",
      closeOnBackdrop = true,
      showCloseButton = true,
      isLoading = false,
      customClass = "",
      children,
      actions,
      className = "",
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLDivElement>) || modalRef;

    const handleBackdropClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          onClose();
        }
      },
      [closeOnBackdrop, onClose]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      },
      [onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
      <div
        ref={resolvedRef}
        className={`${styles.modalBackdrop} ${className}`}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        {...props}
      >
        <div className={`${styles.modalContainer} ${sizeClassMap[size]} ${customClass}`}>
          {/* Close button */}
          {showCloseButton && (
            <button
              className={styles.closeBtn}
              onClick={onClose}
              type="button"
              aria-label="Close modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {/* Modal Title */}
          {title && (
            <h2 id="modal-title" className={styles.modalTitle}>
              {title}
            </h2>
          )}

          {/* Modal Body */}
          <div className={styles.modalBody}>{children}</div>

          {/* Modal Actions */}
          {actions && <div className={styles.modalActions}>{actions}</div>}

          {/* Loading Overlay */}
          {isLoading && (
            <div className={styles.modalLoadingOverlay}>
              <span className="loading loading-spinner loading-md"></span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";
