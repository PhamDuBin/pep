"use client";

import Image from "next/image";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <Image
        src="/icons/logo-pep.svg"
        alt="PEP"
        width={100}
        height={50}
        className={styles.logo}
        priority
      />
    </header>
  );
}
