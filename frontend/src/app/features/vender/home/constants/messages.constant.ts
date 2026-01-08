import { Company, Message, User } from '../models/message.model';

export const MOCK_COMPANIES: Company[] = [
    {
        id: '1',
        name: '株式会社ソラマメ',
        isSelected: true
    },
    {
        id: '2',
        name: '株式会社キャベツ',
        isSelected: false
    },
    {
        id: '3',
        name: '株式会社トマト',
        isSelected: false
    }
];

export const MOCK_MESSAGES: Message[] = [
    {
        id: '1',
        companyId: '1',
        companyName: '株式会社ABC',
        projectName: 'SNSショート動画運用代行',
        preview: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト....',
        timestamp: '12/02 13:23',
        unreadCount: 1,
        isSelected: false
    },
    {
        id: '2',
        companyId: '1',
        companyName: '株式会社ABC',
        projectName: 'ブランド体験型ポップアップスペース',
        preview: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト....',
        timestamp: '12/02 11:49',
        unreadCount: 0,
        isSelected: false
    },
    {
        id: '3',
        companyId: '2',
        companyName: '株式会社XYZ',
        projectName: 'Webサイトリニューアル',
        preview: 'お世話になっております。先日お送りいただいた資料について確認させていただきました....',
        timestamp: '12/01 15:30',
        unreadCount: 2,
        isSelected: false
    },
    {
        id: '4',
        companyId: '3',
        companyName: '株式会社DEF',
        projectName: 'ECサイト構築',
        preview: 'ご提案いただいた内容について、社内で検討させていただきました....',
        timestamp: '11/30 09:15',
        unreadCount: 0,
        isSelected: false
    }
];

export const MOCK_CURRENT_USER: User = {
    id: '1',
    name: '山口 太郎',
    initials: '山口'
};
