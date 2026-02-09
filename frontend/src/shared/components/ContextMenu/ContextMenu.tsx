"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface ContextMenuItem {
  label: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
  position: { x: number; y: number };
}

export function ContextMenu({ isOpen, onClose, items, position }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="fixed bg-white border border-[#cfcfcf] rounded-[4px] shadow-[0px_4px_15px_rgba(0,0,0,0.1)] z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="flex flex-col py-[14px] px-[20px] min-w-[180px]">
            {items.map((item, index) => (
              <motion.button
                key={index}
                className={`flex items-center gap-[5px] py-[6px] px-0 cursor-pointer bg-transparent border-none text-left transition-opacity duration-150 hover:opacity-70 ${
                  item.danger ? "text-red-500" : "text-[#333333]"
                }`}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={22}
                  height={22}
                  className="flex-shrink-0"
                />
                <span className="text-[14px] font-normal leading-[18px]">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
