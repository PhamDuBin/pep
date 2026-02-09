"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface TrialBannerProps {
  daysRemaining: number;
  onUpgrade?: () => void;
}

export function TrialBanner({ daysRemaining, onUpgrade }: TrialBannerProps) {
  const router = useRouter();

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push("/buyer/my-page");
    }
  };

  const isExpired = daysRemaining <= 0;

  return (
    <motion.div
      className="bg-[#f0f0f0] flex gap-[10px] items-center justify-center px-[10px] py-[5px] w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center text-[16px] text-[#333333]">
        <span className="font-normal">無料トライアル期間：</span>
        <span className="font-semibold">
          {isExpired ? "終了" : `残り${daysRemaining}日`}
        </span>
      </div>
      <motion.button
        className="bg-[#066a9e] flex items-center justify-center px-[10px] py-[3px] rounded-[4px] cursor-pointer border-none transition-opacity duration-200 hover:opacity-90"
        onClick={handleUpgradeClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-normal text-[14px] text-white">
          プランを開始する
        </span>
      </motion.button>
    </motion.div>
  );
}
