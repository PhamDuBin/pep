import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorChatMessage, VendorConversation } from '../../../models/carry.model';
import { EMPTY_VENDOR_SELECTION_MESSAGE, MESSAGE_INPUT_PLACEHOLDER } from '../../../constants/carry.constant';

@Component({
  selector: 'app-vendor-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-chat.component.html',
  styleUrl: './vendor-chat.component.scss'
})
export class VendorChatComponent implements AfterViewChecked {
  @Input() conversation: VendorConversation | null = null;
  @Input() isLoading = false;

  @Output() messageSent = new EventEmitter<string>();

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  emptyMessage = EMPTY_VENDOR_SELECTION_MESSAGE;
  inputPlaceholder = MESSAGE_INPUT_PLACEHOLDER;
  messageInput = '';

  private shouldScrollToBottom = true;
  private lastMessageCount = 0;

  ngAfterViewChecked(): void {
    const messages = this.conversation?.messages || [];
    if (messages.length !== this.lastMessageCount) {
      this.lastMessageCount = messages.length;
      this.shouldScrollToBottom = true;
    }

    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  onSendMessage(): void {
    if (this.messageInput.trim()) {
      this.messageSent.emit(this.messageInput.trim());
      this.messageInput = '';
      this.shouldScrollToBottom = true;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
  }

  trackByMessageId(index: number, message: VendorChatMessage): string {
    return message.id;
  }

  private scrollToBottom(): void {
    try {
      const element = this.messagesContainer?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
