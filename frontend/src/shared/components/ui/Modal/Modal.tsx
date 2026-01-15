"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"> {
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
  sm: "min-w-[400px] max-w-[400px]",
  md: "min-w-[500px] max-w-[500px]",
  lg: "min-w-[700px] max-w-[700px]",
  xl: "min-w-[800px] max-w-[800px]",
};

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
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

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={resolvedRef}
            className={className}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            {...props}
          >
            <motion.div
              className={`${sizeClassMap[size]} ${customClass}`}
              style={{
                position: "relative",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              {showCloseButton && (
                <motion.button
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "24px",
                    height: "24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    color: "#808080",
                    borderRadius: "4px",
                  }}
                  onClick={onClose}
                  type="button"
                  aria-label="Close modal"
                  whileHover={{ scale: 1.1, color: "#333333" }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>
              )}

              {/* Modal Title */}
              {title && (
                <h2
                  id="modal-title"
                  className="modal-title"
                  style={{
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "normal",
                    color: "#066a9e",
                    margin: 0,
                    textAlign: "center",
                    paddingRight: "24px",
                  }}
                >
                  {title}
                </h2>
              )}

              {/* Modal Body */}
              <div
                className="modal-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {children}
              </div>

              {/* Modal Actions */}
              {actions && (
                <div
                  className="modal-actions"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {actions}
                </div>
              )}

              {/* Loading Overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="loading loading-spinner loading-md"></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = "Modal";
