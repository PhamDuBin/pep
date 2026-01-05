import { Tab } from '../models/tab.model';

export const HOME_TABS: Tab[] = [
  {
    id: 'kick',
    label: 'kick',
    subLabel: '（プロジェクト計画作成→提案依頼）',
    icon: 'kick',
    isActive: true,
    isDisabled: false
  },
  {
    id: 'carry',
    label: 'carry',
    subLabel: '（ベンダーとのコミュニケーション）',
    icon: 'carry',
    isActive: false,
    isDisabled: false
  }
];
