import { Component, Input, ElementRef, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges, NgZone } from '@angular/core';
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
export class SharedChatMessageListComponent implements OnChanges {
  @Input() messages: ChatMessage[] = [];
  @Input() isLoading = false;
  @Input() loadingText = 'AIが考えています...';
  @Input() messageVariant: ChatMessageVariant = 'minimal';
  @Input() animateMessages = true;
  @Input() typingSpeed = 10;
  @Input() charsPerFrame = 5;
  @Input() useInternalScroll = true;

  @Output() contentChanged = new EventEmitter<void>();

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  private shouldScrollToBottom = true;
  private scrollThrottleTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] || changes['isLoading']) {
      this.contentChanged.emit();

      if (this.useInternalScroll && this.shouldScrollToBottom) {
        // Use requestAnimationFrame for smooth scrolling
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => {
            this.scrollToBottom();
          });
        });
      }
    }
  }

  onScroll(): void {
    if (!this.useInternalScroll) return;

    // Throttle scroll handler
    if (this.scrollThrottleTimer) return;

    this.scrollThrottleTimer = setTimeout(() => {
      this.scrollThrottleTimer = null;
      const element = this.messageContainer?.nativeElement;
      if (element) {
        const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
        this.shouldScrollToBottom = atBottom;
      }
    }, 100);
  }

  private scrollToBottom(): void {
    try {
      const element = this.messageContainer?.nativeElement;
      if (element) {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: 'auto'
        });
      }
    } catch (err) {
      // Ignore scroll errors
    }
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }
}
