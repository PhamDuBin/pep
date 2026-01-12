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

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps extends HTMLAttributes<HTMLDialogElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

const sizeClassMap: Record<ModalSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  full: styles.sizeFull,
};

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = "md",
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      children,
      footer,
      className = "",
      ...props
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLDialogElement>) || dialogRef;

    const handleBackdropClick = useCallback(
      (event: React.MouseEvent<HTMLDialogElement>) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          onClose();
        }
      },
      [closeOnBackdropClick, onClose]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (closeOnEscape && event.key === "Escape") {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      const dialog = resolvedRef.current;
      if (!dialog) return;

      if (isOpen) {
        dialog.showModal();
        document.body.style.overflow = "hidden";
      } else {
        dialog.close();
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen, resolvedRef]);

    useEffect(() => {
      if (isOpen && closeOnEscape) {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
        };
      }
    }, [isOpen, closeOnEscape, handleKeyDown]);

    const modalClasses = [
      "modal",
      styles.modal,
      isOpen ? "modal-open" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const boxClasses = [
      "modal-box",
      styles.modalBox,
      sizeClassMap[size],
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <dialog
        ref={resolvedRef}
        className={modalClasses}
        onClick={handleBackdropClick}
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        {...props}
      >
        <div className={boxClasses}>
          {(title || showCloseButton) && (
            <header className={styles.header}>
              {title && (
                <h3 id="modal-title" className={styles.title}>
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </header>
          )}

          <div className={styles.content}>{children}</div>

          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={onClose} aria-label="Close">
            close
          </button>
        </form>
      </dialog>
    );
  }
);

Modal.displayName = "Modal";
