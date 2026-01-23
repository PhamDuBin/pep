"use client";

import Image from "next/image";

export function Header() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "65px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e1e1e1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Image
        src="/assets/icons/logo-pep.svg"
        alt="PEP"
        width={100}
        height={50}
        style={{ height: "50px", width: "auto" }}
        priority
      />
    </header>
  );
}
