import { ChatMode } from '../models/chat-mode.model';

export const CHAT_MODES: ChatMode[] = [
  {
    id: 'project-plan',
    name: 'プロジェクト計画書作成モード',
    iconPath: 'assets/icons/flag.svg',
    description: 'プロジェクト計画書の作成をサポートします',
    isActive: true
  },
  {
    id: 'rfp-creation',
    name: 'RFP作成モード',
    iconPath: 'assets/icons/flag.svg',
    description: 'RFP（提案依頼書）の作成をサポートします',
    isActive: false
  },
  {
    id: 'general',
    name: '一般質問モード',
    iconPath: 'assets/icons/flag.svg',
    description: '一般的な質問にお答えします',
    isActive: false
  }
];

export const DEFAULT_CHAT_MODE: ChatMode = CHAT_MODES[0];
