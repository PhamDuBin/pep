import { Project, Tab } from "@/shared/types";

export const INITIAL_PROJECTS: Project[] = [
  { id: "1", name: "SNSショート動画...", isSelected: true },
  { id: "2", name: "Z世代向けインフルエ...", isSelected: false },
  { id: "3", name: "ドーナツPRイベント...", isSelected: false },
  { id: "4", name: "ライブコマース運営...", isSelected: false },
  { id: "5", name: "ブランド体験型ポッ...", isSelected: false },
  { id: "6", name: "AIタレント・バーチ...", isSelected: false },
];

export const HOME_TABS: Tab[] = [
  {
    id: "kick",
    label: "kick",
    subLabel: "（プロジェクト計画作成→提案依頼）",
    icon: "kick",
    isActive: true,
    isDisabled: false,
  },
  {
    id: "carry",
    label: "carry",
    subLabel: "（ベンダーとのコミュニケーション）",
    icon: "carry",
    isActive: false,
    isDisabled: false,
  },
];
