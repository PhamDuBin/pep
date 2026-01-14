"use client";

import { Suspense } from "react";
import { AiChatContent } from "./components";
import styles from "./AiChatPage.module.scss";

export function AiChatPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading...</div>}>
      <AiChatContent />
    </Suspense>
  );
}
