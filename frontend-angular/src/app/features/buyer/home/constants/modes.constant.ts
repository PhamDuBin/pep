import { Mode } from '../models/mode.model';

export const PLANNING_MODE: Mode = {
  id: 'planning',
  name: 'プロジェクト計画書作成モード',
  iconPath: 'assets/icons/flag.svg',
  description: 'Create project planning documents'
};

export const AVAILABLE_MODES: Mode[] = [
  PLANNING_MODE
];
