"use client";

import Link from "next/link";

export function FooterRegister() {
  return (
    <footer
      style={{
        width: "100%",
        borderTop: "1px solid #cfcfcf",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "25px",
        padding: "50px 10px",
        fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "normal",
        marginTop: "50px",
      }}
    >
      <Link
        href="/terms"
        style={{
          color: "#066a9e",
          textDecoration: "underline",
          flexShrink: 0,
        }}
      >
        利用規約
      </Link>
      <Link
        href="/privacy"
        style={{
          color: "#066a9e",
          textDecoration: "underline",
          flexShrink: 0,
        }}
      >
        プライバシーポリシー
      </Link>
    </footer>
  );
}
