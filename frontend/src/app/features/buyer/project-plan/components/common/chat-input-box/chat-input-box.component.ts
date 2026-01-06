import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input-box.component.html',
  styleUrl: './chat-input-box.component.scss'
})
export class ChatInputBoxComponent {
  @Input() placeholder = 'プロジェクトの概要、開始時期、業種、期間を入力してください';

  @Output() messageSent = new EventEmitter<string>();
  @Output() microphoneClicked = new EventEmitter<void>();

  message = '';

  sendMessage(): void {
    if (this.message.trim()) {
      this.messageSent.emit(this.message.trim());
      this.message = '';
    }
  }

  onMicrophoneClick(): void {
    this.microphoneClicked.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
