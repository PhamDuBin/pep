"use client";

import { useState, useCallback } from "react";
import { Tab } from "@/shared/types";

interface TabNavigationProps {
  tabs: Tab[];
  onTabChange?: (tab: Tab) => void;
}

export function TabNavigation({
  tabs: initialTabs,
  onTabChange,
}: TabNavigationProps) {
  const [tabs, setTabs] = useState(initialTabs);

  const handleTabSelect = useCallback(
    (tab: Tab) => {
      if (tab.isDisabled) return;

      const updatedTabs = tabs.map((t) => ({
        ...t,
        isActive: t.id === tab.id,
      }));
      setTabs(updatedTabs);
      onTabChange?.(tab);
    },
    [tabs, onTabChange]
  );

  return (
    <nav className="h-[94px] bg-[#ffffff] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 flex items-center justify-center gap-[10px] p-[25px_10px] transition-all duration-200 border-b border-t-0 border-l-0 border-r-0 cursor-pointer bg-transparent ${
            tab.isActive ? "border-b-[#066a9e]" : "border-b-[#b9b9b9]"
          } ${
            tab.isDisabled
              ? "cursor-not-allowed"
              : "hover:bg-[#066a9e] [&:hover_span]:!text-[#ffffff] [&:hover_path]:!fill-[#ffffff] [&:hover_circle]:!fill-[#ffffff]"
          }`}
          disabled={tab.isDisabled}
          onClick={() => handleTabSelect(tab)}
        >
          {/* Kick Icon */}
          {tab.icon === "kick" && (
            <svg
              width="40"
              height="40"
              viewBox="0 4 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200"
            >
              <path
                className={`transition-[fill] duration-200 ${
                  tab.isActive ? "fill-[#066a9e]" : "fill-[#808080]"
                }`}
                d="M19.922 9.831C18.695 9.839 17.398 10.912 16.953 12.629C16.445 14.594 17.32 16.367 18.68 16.719C20.039 17.07 21.664 15.945 22.172 13.984C22.68 12.019 21.812 10.248 20.445 9.896C20.273 9.852 20.102 9.83 19.922 9.831ZM4.206 11.336L3.305 12.821C5.836 14.07 8.234 15.438 10.836 16.453C11.578 16.156 12.305 15.844 13.023 15.516C9.883 14.313 7.031 12.884 4.206 11.336ZM15.773 15.719C12.039 17.703 8.125 18.969 3.77 20.492L4.402 21.773C8.461 20.516 13.094 19.203 16.992 17.398C16.453 16.969 16.047 16.391 15.773 15.719ZM18.141 18.438C16.383 19.281 14.484 20.016 12.562 20.68C10.977 24.242 10.398 28.094 9.688 31.625L9.523 32.445L1.631 29.367L0.379 31.352L10.555 36.094C10.633 35.984 10.687 35.898 10.781 35.742C11.086 35.219 11.5 34.445 11.969 33.508C12.898 31.648 14.055 29.141 15.125 26.625C16.203 24.117 17.188 21.594 17.773 19.719C17.922 19.242 18.047 18.812 18.141 18.438ZM15.648 28.953C15.219 29.93 14.781 30.891 14.359 31.789C16.312 34.711 18.812 37.961 21.773 40.32L23.594 38.945C20.797 35.844 17.898 32.359 15.648 28.953ZM30.367 34.672C29.373 34.672 28.419 35.067 27.716 35.77C27.012 36.473 26.617 37.427 26.617 38.422C26.617 39.416 27.012 40.37 27.716 41.074C28.419 41.777 29.373 42.172 30.367 42.172C31.362 42.172 32.316 41.777 33.019 41.074C33.722 40.37 34.117 39.416 34.117 38.422C34.117 37.427 33.722 36.473 33.019 35.77C32.316 35.067 31.362 34.672 30.367 34.672Z"
                fill="currentColor"
              />
            </svg>
          )}

          {/* Carry Icon */}
          {tab.icon === "carry" && (
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-colors duration-200"
            >
              <path
                className={`transition-[fill] duration-200 ${
                  tab.isActive ? "fill-[#066a9e]" : "fill-[#808080]"
                }`}
                d="M3.016 18.676L6.319 17.559L6.897 17.848C8.225 18.511 9.702 18.864 11.25 18.864C16.422 18.864 20.625 14.792 20.625 10.27C20.625 5.748 16.422 1.676 11.25 1.676C6.078 1.676 1.875 5.748 1.875 10.27C1.875 11.957 2.484 13.67 3.605 15.134L4.144 15.837L3.014 18.659L3.016 18.676ZM1.911 20.676C1.77 20.724 1.618 20.73 1.473 20.693C1.328 20.657 1.197 20.58 1.095 20.472C0.992 20.363 0.923 20.228 0.895 20.081C0.867 19.935 0.882 19.783 0.937 19.645L2.362 16.082C1.062 14.379 0.312 12.342 0.312 10.27C0.312 5.092 5 0.114 11.25 0.114C17.5 0.114 22.188 5.092 22.188 10.27C22.188 15.448 17.5 20.426 11.25 20.426C9.497 20.431 7.767 20.027 6.198 19.245L1.911 20.675V20.676Z"
                fill="currentColor"
              />
              <circle
                className={`transition-[fill] duration-200 ${
                  tab.isActive ? "fill-[#066a9e]" : "fill-[#808080]"
                }`}
                cx="7"
                cy="10"
                r="1.5"
              />
              <circle
                className={`transition-[fill] duration-200 ${
                  tab.isActive ? "fill-[#066a9e]" : "fill-[#808080]"
                }`}
                cx="11.25"
                cy="10"
                r="1.5"
              />
              <circle
                className={`transition-[fill] duration-200 ${
                  tab.isActive ? "fill-[#066a9e]" : "fill-[#808080]"
                }`}
                cx="15.5"
                cy="10"
                r="1.5"
              />
            </svg>
          )}

          <div className="flex flex-col items-center">
            <span
              className={`text-[16px] font-bold text-center transition-colors duration-200 ${
                tab.isActive ? "text-[#066a9e]" : "text-[#808080]"
              }`}
            >
              {tab.label}
            </span>
            <span
              className={`text-[16px] text-center transition-colors duration-200 ${
                tab.isActive ? "text-[#066a9e] font-bold" : "text-[#808080]"
              }`}
            >
              {tab.subLabel}
            </span>
          </div>
        </button>
      ))}
    </nav>
  );
}
