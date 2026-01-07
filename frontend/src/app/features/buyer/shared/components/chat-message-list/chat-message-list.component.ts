import { Component, Input, ElementRef, ViewChild, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../models/chat.model';
import { SharedChatMessageComponent, ChatMessageVariant } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-shared-chat-message-list',
  standalone: true,
  imports: [CommonModule, SharedChatMessageComponent],
  templateUrl: './chat-message-list.component.html',
  styleUrl: './chat-message-list.component.scss'
})
export class SharedChatMessageListComponent implements AfterViewChecked {
  @Input() messages: ChatMessage[] = [];
  @Input() isLoading = false;
  @Input() loadingText = 'AIが考えています...';
  @Input() messageVariant: ChatMessageVariant = 'minimal';
  @Input() animateMessages = true;
  @Input() typingSpeed = 10;
  @Input() charsPerFrame = 5;
  @Input() useInternalScroll = true; // When false, parent manages scrolling

  @Output() contentChanged = new EventEmitter<void>(); // Emits when content changes (for parent scroll)

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  private shouldScrollToBottom = true;
  private lastMessageCount = 0;

  ngAfterViewChecked(): void {
    // Detect content changes
    if (this.messages.length !== this.lastMessageCount) {
      this.lastMessageCount = this.messages.length;
      this.contentChanged.emit();
    }

    if (this.useInternalScroll && this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  onScroll(): void {
    if (!this.useInternalScroll) return;

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
