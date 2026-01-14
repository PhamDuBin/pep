export interface Company {
    id: string;
    name: string;
    isSelected?: boolean;
}

export interface Message {
    id: string;
    companyId: string;
    companyName: string;
    projectName?: string;
    preview: string;
    timestamp: string;
    unreadCount: number;
    isSelected?: boolean;
}

export interface ChatMessage {
    id: string;
    content: string;
    timestamp: string;
    isFromUser: boolean;
}

export interface User {
    id: string;
    name: string;
    initials: string;
}
