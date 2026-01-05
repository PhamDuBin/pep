import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  message = '';

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }
}
