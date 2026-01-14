"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedDropdownProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  direction?: "down" | "up";
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const dropdownUpVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: 5,
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

export function AnimatedDropdown({
  isOpen,
  children,
  className = "",
  direction = "down",
}: AnimatedDropdownProps) {
  const variants = direction === "down" ? dropdownVariants : dropdownUpVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
