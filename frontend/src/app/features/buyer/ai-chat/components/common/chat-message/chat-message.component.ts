import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../models/chat-message.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) message!: ChatMessage;
  @Input() animate = false;
  @Input() typingSpeed = 10; // milliseconds per character

  displayedContent = '';
  isTyping = false;
  private typingTimeout: any;
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
        // Add multiple characters at once for faster typing
        const charsToAdd = Math.min(5, content.length - this.currentIndex);
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
