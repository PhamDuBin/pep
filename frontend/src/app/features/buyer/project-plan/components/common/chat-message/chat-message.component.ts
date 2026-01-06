import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/project-plan.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent implements OnInit, OnDestroy {
  @Input() message!: ChatMessage;

  displayedContent = '';
  isTyping = false;
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (this.message.isNew && this.message.sender === 'ai') {
      this.startTypingEffect();
    } else {
      this.displayedContent = this.message.content;
    }
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  private startTypingEffect(): void {
    this.isTyping = true;
    this.displayedContent = '';
    const content = this.message.content;
    let currentIndex = 0;

    this.ngZone.runOutsideAngular(() => {
      const typeNextChar = () => {
        if (currentIndex < content.length) {
          this.ngZone.run(() => {
            this.displayedContent = content.substring(0, currentIndex + 1);
            this.cdr.detectChanges();
          });
          currentIndex++;
          this.typingTimeout = setTimeout(typeNextChar, 15);
        } else {
          this.ngZone.run(() => {
            this.isTyping = false;
            this.cdr.detectChanges();
          });
        }
      };
      this.typingTimeout = setTimeout(typeNextChar, 100);
    });
  }
}
