import { Injectable, signal } from '@angular/core';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'system';
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSignal = signal<ChatMessage[]>([]);

  // Expose as readonly signal
  messages = this.messagesSignal.asReadonly();

  sendMessage(content: string): void {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender: 'user'
    };
    
    this.messagesSignal.update(messages => [...messages, newMessage]);
    
    // Simulate system response (replace with actual API call)
    this.simulateSystemResponse(content);
  }

  private simulateSystemResponse(userMessage: string): void {
    setTimeout(() => {
      const systemMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Response to: ${userMessage}`,
        timestamp: new Date(),
        sender: 'system'
      };
      this.messagesSignal.update(messages => [...messages, systemMessage]);
    }, 1000);
  }

  clearMessages(): void {
    this.messagesSignal.set([]);
  }
}
