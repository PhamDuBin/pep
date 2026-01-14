import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
    {
        id: 1,
        name: '山田 太郎',
        email: 'yamada.taro@example.com',
        role: '管理者',
        avatarColor: '#8EC5D0',
        initials: 'YT',
        selected: false
    },
    {
        id: 2,
        name: '宮崎 花子',
        email: 'miyazaki.hanako@example.com',
        role: 'メンバー',
        avatarColor: '#8EC5D0',
        initials: 'MH',
        selected: false
    },
    {
        id: 3,
        name: '東 次郎',
        email: 'higashi.jiro@example.com',
        role: 'メンバー',
        avatarColor: '#8EC5D0',
        initials: 'HJ',
        selected: false
    },
    {
        id: 4,
        name: '千葉 三郎',
        email: 'chiba.saburo@example.com',
        role: 'メンバー',
        avatarColor: '#8EC5D0',
        initials: 'CS',
        selected: false
    },
    {
        id: 5,
        name: '福岡 麻美',
        email: 'fukuoka.asami@example.com',
        role: '管理者',
        avatarColor: '#8EC5D0',
        initials: 'FA',
        selected: false
    }
];
