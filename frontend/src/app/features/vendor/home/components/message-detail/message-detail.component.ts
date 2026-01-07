import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../models/message.model';

@Component({
    selector: 'app-message-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './message-detail.component.html',
    styleUrls: ['./message-detail.component.scss']
})
export class MessageDetailComponent {
    @Input() messageId: string | null = null;

    // Mock data for demonstration
    companyName = '株式会社ソラマメ';
    projectName = 'ブランド体験型ポップアップスペース';

    messages = signal<ChatMessage[]>([
        {
            id: '1',
            content: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト',
            timestamp: '12/02 11:49',
            isFromUser: false
        },
        {
            id: '2',
            content: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト',
            timestamp: '12/02 11:49',
            isFromUser: true
        },
        {
            id: '3',
            content: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト',
            timestamp: '12/02 11:49',
            isFromUser: false
        },
        {
            id: '4',
            content: 'テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト',
            timestamp: '12/02 11:49',
            isFromUser: true
        }
    ]);

    newMessage = '';

    sendMessage() {
        if (this.newMessage.trim()) {
            const message: ChatMessage = {
                id: Date.now().toString(),
                content: this.newMessage,
                timestamp: new Date().toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                isFromUser: true
            };
            this.messages.update(msgs => [...msgs, message]);
            this.newMessage = '';
        }
    }
}
