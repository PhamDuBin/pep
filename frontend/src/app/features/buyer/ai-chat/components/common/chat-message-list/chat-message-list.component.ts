import { Component, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/chat-message.model';
import { ChatMessageComponent } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-chat-message-list',
  standalone: true,
  imports: [CommonModule, ChatMessageComponent],
  templateUrl: './chat-message-list.component.html',
  styleUrl: './chat-message-list.component.scss'
})
export class ChatMessageListComponent implements AfterViewChecked {
  @Input() messages: ChatMessage[] = [];
  @Input() isLoading = false;

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  private shouldScrollToBottom = true;

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  onScroll(): void {
    const element = this.messageContainer?.nativeElement;
    if (element) {
      const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
      this.shouldScrollToBottom = atBottom;
    }
  }

  private scrollToBottom(): void {
    try {
      const element = this.messageContainer?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }
}
