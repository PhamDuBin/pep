import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorChatMessage, VendorConversation, ChatMember } from '../../../models/carry.model';
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
  @Input() members: ChatMember[] = [];

  @Output() messageSent = new EventEmitter<string>();
  @Output() addMemberClicked = new EventEmitter<void>();
  @Output() exitChatClicked = new EventEmitter<void>();

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  emptyMessage = EMPTY_VENDOR_SELECTION_MESSAGE;
  inputPlaceholder = MESSAGE_INPUT_PLACEHOLDER;
  messageInput = '';
  showMemberDropdown = false;

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

  toggleMemberDropdown(): void {
    this.showMemberDropdown = !this.showMemberDropdown;
  }

  closeMemberDropdown(): void {
    this.showMemberDropdown = false;
  }

  onAddMemberClick(): void {
    this.showMemberDropdown = false;
    this.addMemberClicked.emit();
  }

  onExitChatClick(): void {
    this.showMemberDropdown = false;
    this.exitChatClicked.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.add-person-container');
    if (!dropdown && this.showMemberDropdown) {
      this.showMemberDropdown = false;
    }
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
