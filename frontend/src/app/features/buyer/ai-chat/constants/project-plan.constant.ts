import { ProjectPlan, PdfPage, Vendor, ProjectPlanContent } from '../models/project-plan.model';

export const MOCK_PROJECT_PLAN_CONTENT: ProjectPlanContent = {
  background: `花屋業界での人手不足や業務効率化の課題が顕在化している
AI技術の進展により、接客や在庫管理の自動化が可能となってきた
顧客体験の向上と売上拡大を目指し、AI活用の必要性が高まっている`,
  purpose: `AIを活用したお花屋さんの新規事業モデルを構築し、業務効率化と顧客満足度向上を実現する`,
  goal: `1年以内にAIを活用した店舗運営システムを導入・運用開始する
顧客対応や在庫管理の自動化により、業務負荷を30%削減する`,
  scope: [
    {
      phase: '1',
      item: '企画・要件定義',
      period: '2026年3-4月',
      description: 'AI導入目的の明確化、要件整理と関係者調整'
    },
    {
      phase: '2',
      item: 'プロジェクトスコープ',
      period: '2026年5-6月',
      description: 'フェーズ項目概要実施時期の決定'
    }
  ],
  schedule: [
    { phase: 1, name: '企画・要件定義', period: '2026年3-4月', description: 'AI導入目的の明確化、要件整理と関係者調整' },
    { phase: 2, name: '設計・開発', period: '2026年5-8月', description: 'システム設計と開発' },
    { phase: 3, name: 'テスト・導入', period: '2026年9-10月', description: 'テストと本番導入' },
    { phase: 4, name: '運用・改善', period: '2026年11月-2027年2月', description: '運用開始と継続的改善' }
  ],
  qualityStandards: [
    'AI応答精度95%以上',
    'システム稼働率99.5%以上',
    '顧客満足度80%以上'
  ],
  staffing: [
    { department: 'プロジェクト管理', count: 1, duration: '12ヶ月', unitPrice: '90万円/月', total: '1,080万円' },
    { department: 'AIエンジニア', count: 2, duration: '8ヶ月', unitPrice: '85万円/月', total: '1,360万円' },
    { department: 'システム開発', count: 2, duration: '8ヶ月', unitPrice: '80万円/月', total: '1,280万円' },
    { department: '店舗運営・研修', count: 2, duration: '4ヶ月', unitPrice: '60万円/月', total: '480万円' }
  ],
  totalCost: '4,200万円'
};

export const MOCK_PDF_PAGES: PdfPage[] = [
  { id: 'page-1', pageNumber: 1, title: '目的・ゴール' },
  { id: 'page-2', pageNumber: 2, title: 'スコープ' },
  { id: 'page-3', pageNumber: 3, title: '日程計画' },
  { id: 'page-4', pageNumber: 4, title: '品質基準' },
  { id: 'page-5', pageNumber: 5, title: '要員・コスト計画' }
];

export const MOCK_PROJECT_PLAN: ProjectPlan = {
  id: 'plan-001',
  title: 'AIを利用したお花屋さん・2026年3月開始・花屋・1年間',
  content: MOCK_PROJECT_PLAN_CONTENT,
  pdfPages: MOCK_PDF_PAGES,
  status: 'preview',
  createdAt: new Date('2024-01-15T10:00:00'),
  updatedAt: new Date('2024-01-15T10:05:00')
};

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: '株式会社イチジク', isSelected: true },
  { id: 'v2', name: '株式会社チェリー', isSelected: true },
  { id: 'v3', name: '株式会社ピーチ', isSelected: true },
  { id: 'v4', name: '株式会社バナナ', isSelected: true },
  { id: 'v5', name: '株式会社ペアー', isSelected: true },
  { id: 'v6', name: '株式会社メロン', isSelected: true },
  { id: 'v7', name: '株式会社マンゴー', isSelected: true },
  { id: 'v8', name: '株式会社ライチ', isSelected: true },
  { id: 'v9', name: '株式会社レモン', isSelected: true },
  { id: 'v10', name: '株式会社パパイヤ', isSelected: true }
];

export const PROJECT_PLAN_AI_RESPONSE = `プロジェクト実行計画書
1. 背景・目的・ゴール
背景・経緯:

花屋業界での人手不足や業務効率化の課題が顕在化している
AI技術の進展により、接客や在庫管理の自動化が可能となってきた
顧客体験の向上と売上拡大を目指し、AI活用の必要性が高まっている
目的:

AIを活用したお花屋さんの新規事業モデルを構築し、業務効率化と顧客満足度向上を実現する
ゴール:

1年以内にAIを活用した店舗運営システムを導入・運用開始する
顧客対応や在庫管理の自動化により、業務負荷を30%削減する
2. プロジェクトスコープ
フェーズ 項目 概要 実施時期
1 企画・要件定義 AI導入目的の明確化、要件整理と関係者調整 2026年3-4月`;

export const PROJECT_PLAN_COST_RESPONSE = `5. 要員・コスト計画
部署 人数 期間 単価 合計
プロジェクト管理 1名 12ヶ月 90万円/月 1,080万円
AIエンジニア 2名 8ヶ月 85万円/月 1,360万円
システム開発 2名 8ヶ月 80万円/月 1,280万円
店舗運営・研修 2名 4ヶ月 60万円/月 480万円
総額: 4,200万円`;

export const MODE_DESCRIPTION = 'プロジェクト概要から5項目(目的・ゴール/スコープ/日程計画/品質基準/体制・役割)に構造化されたPDF計画書を自動生成します';

export const CHAT_INPUT_PLACEHOLDER = 'プロジェクトの概要、開始時期、業種、期間を入力してください（5項目のPDF計画書に構造化されます）';
