import { ChatMessage, ChatConversation } from '../models/chat-message.model';

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    content: 'こんにちは',
    timestamp: new Date('2024-01-15T10:00:00'),
    sender: 'user',
    isNew: false
  },
  {
    id: '2',
    content: 'こんにちは！何かお困りごとや質問があれば、どうぞ教えてください。',
    timestamp: new Date('2024-01-15T10:00:05'),
    sender: 'ai',
    isNew: false
  },
  {
    id: '3',
    content: 'RFPとはなんですか',
    timestamp: new Date('2024-01-15T10:01:00'),
    sender: 'user',
    isNew: false
  },
  {
    id: '4',
    content: `「RFP」とは、**Request For Proposal（リクエスト・フォー・プロポーザル）**の略です。日本語では「提案依頼書」や「提案依頼」と訳されます。

主な意味・用途
企業や団体が、特定の業務やプロジェクトを外部の会社に依頼したいときに、その内容や条件をまとめて提示し、提案（プロポーザル）を募集するための文書やプロセスです。
例えば、システム開発、広告制作、コンサルティングなどの分野でよく使われます。

RFPの流れ（例）
発注側（依頼主）がRFPを作成し、必要な要件や条件を明記する。
複数の企業や業者にRFPを配布する。
受け取った企業が提案書（プロポーザル）を作成し、提出する。
発注側が提案内容を比較・評価し、最適な業者を選定する。

似た用語
RFQ（Request For Quotation）：見積依頼書
RFI（Request For Information）：情報提供依頼書

もし、さらに詳しい説明や、RFPの書き方など知りたいことがあれば教えてください！`,
    timestamp: new Date('2024-01-15T10:01:10'),
    sender: 'ai',
    highlightedText: 'RFQ（Request For Quotation）：見積依頼書\nRFI（Request For Information）：情報提供依頼書',
    isNew: false
  }
];

export const MOCK_CONVERSATION: ChatConversation = {
  id: 'conv-001',
  projectId: '1',
  messages: MOCK_CHAT_MESSAGES,
  createdAt: new Date('2024-01-15T10:00:00'),
  updatedAt: new Date('2024-01-15T10:01:10')
};

export const AI_RESPONSES: Record<string, string> = {
  default: 'ご質問ありがとうございます。お答えいたします。',
  greeting: 'こんにちは！何かお困りごとや質問があれば、どうぞ教えてください。',
  rfp: `「RFP」とは、**Request For Proposal（リクエスト・フォー・プロポーザル）**の略です。日本語では「提案依頼書」や「提案依頼」と訳されます。

主な意味・用途
企業や団体が、特定の業務やプロジェクトを外部の会社に依頼したいときに、その内容や条件をまとめて提示し、提案（プロポーザル）を募集するための文書やプロセスです。
例えば、システム開発、広告制作、コンサルティングなどの分野でよく使われます。

RFPの流れ（例）
発注側（依頼主）がRFPを作成し、必要な要件や条件を明記する。
複数の企業や業者にRFPを配布する。
受け取った企業が提案書（プロポーザル）を作成し、提出する。
発注側が提案内容を比較・評価し、最適な業者を選定する。

似た用語
RFQ（Request For Quotation）：見積依頼書
RFI（Request For Information）：情報提供依頼書

もし、さらに詳しい説明や、RFPの書き方など知りたいことがあれば教えてください！`,
  project: 'プロジェクトについてのご質問ですね。詳しくお聞かせください。',
  help: 'お手伝いできることがあれば、お気軽にお聞きください。プロジェクト計画の作成、RFPの作成、ベンダー選定など、様々なサポートが可能です。'
};
