"use client";

import { Suspense } from "react";
import { AiChatContent } from "./components";

export function AiChatPage() {
  return (
    <Suspense fallback={<div className="flex flex-col h-full bg-white">Loading...</div>}>
      <AiChatContent />
    </Suspense>
  );
}
