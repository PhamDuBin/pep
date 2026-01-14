import { Component } from '@angular/core';
import { AiChatComponent } from '../components/ai-chat/ai-chat.component';

@Component({
  selector: 'app-ai-chat-page',
  standalone: true,
  imports: [AiChatComponent],
  template: '<app-ai-chat></app-ai-chat>'
})
export class AiChatPageComponent {}
