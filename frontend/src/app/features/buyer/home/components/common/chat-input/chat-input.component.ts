import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Output() messageSent = new EventEmitter<string>();

  message = '';

  sendMessage() {
    if (this.message.trim()) {
      this.messageSent.emit(this.message.trim());
      this.message = '';
    }
  }
}
