import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatMessage } from '../../../models/project-plan.model';

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

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private shouldScroll = true;

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.scrollContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }
}
