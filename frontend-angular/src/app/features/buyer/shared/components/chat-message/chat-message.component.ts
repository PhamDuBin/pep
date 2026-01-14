import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../models/chat.model';

export type ChatMessageVariant = 'minimal' | 'with-avatar';

@Component({
  selector: 'app-shared-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class SharedChatMessageComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) message!: ChatMessage;
  @Input() animate = false;
  @Input() typingSpeed = 10;
  @Input() charsPerFrame = 5;
  @Input() variant: ChatMessageVariant = 'minimal';
  @Input() showSkipHint = true;

  displayedContent = '';
  isTyping = false;
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentIndex = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  get isUserMessage(): boolean {
    return this.message.sender === 'user';
  }

  get hasHighlight(): boolean {
    return !!this.message.highlightedText;
  }

  ngOnInit(): void {
    this.initializeContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] || changes['animate']) {
      this.clearTypingTimeout();
      this.initializeContent();
    }
  }

  ngOnDestroy(): void {
    this.clearTypingTimeout();
  }

  private initializeContent(): void {
    if (this.animate && !this.isUserMessage && this.message.isNew) {
      this.startTypingEffect();
    } else {
      this.displayedContent = this.message.content;
      this.isTyping = false;
    }
  }

  private startTypingEffect(): void {
    this.isTyping = true;
    this.displayedContent = '';
    this.currentIndex = 0;
    const content = this.message.content;

    this.ngZone.runOutsideAngular(() => {
      this.typeNextChars(content);
    });
  }

  private typeNextChars(content: string): void {
    if (this.currentIndex < content.length) {
      this.ngZone.run(() => {
        const charsToAdd = Math.min(this.charsPerFrame, content.length - this.currentIndex);
        this.displayedContent += content.substring(this.currentIndex, this.currentIndex + charsToAdd);
        this.currentIndex += charsToAdd;
        this.cdr.detectChanges();
      });

      this.typingTimeout = setTimeout(() => {
        this.typeNextChars(content);
      }, this.typingSpeed);
    } else {
      this.ngZone.run(() => {
        this.isTyping = false;
        this.cdr.detectChanges();
      });
    }
  }

  private clearTypingTimeout(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  skipTyping(): void {
    this.clearTypingTimeout();
    this.displayedContent = this.message.content;
    this.isTyping = false;
    this.cdr.detectChanges();
  }
}
