"use client";

import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[89px] bg-white border-b border-[#e1e1e1] flex items-center justify-center z-50 shadow-[0px_4px_15px_rgba(0,0,0,0.05)]">
      <Image
        src="/assets/icons/logo-pep.svg"
        alt="PEP"
        width={100}
        height={50}
        className="h-[50px] w-auto"
        priority
      />
    </header>
  );
}
