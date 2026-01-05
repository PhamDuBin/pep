import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex items-center gap-[10px] w-full max-w-[800px]">
      <!-- Input Container -->
      <div class="flex items-center flex-1 gap-[10px] pl-[15px] pr-[10px] py-[10px] h-[45px] bg-white border border-border-gray rounded-full shadow-input hover:bg-[#F4FAFB] hover:border-avatar-bg focus-within:bg-[#F4FAFB] focus-within:border-avatar-bg transition-colors">
        <input
          type="text"
          [(ngModel)]="message"
          placeholder="何でもお聞きください！"
          class="flex-1 text-[13px] text-text-dark placeholder-text-gray outline-none border-none bg-transparent"
          (keydown.enter)="sendMessage()"
        />
      </div>

      <!-- Mic Button -->
      <button class="w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.6154 5.76925C19.6154 3.22025 17.549 1.15387 15 1.15387C12.451 1.15387 10.3846 3.22025 10.3846 5.76925V13.4616C10.3846 16.0106 12.451 18.0769 15 18.0769C17.549 18.0769 19.6154 16.0106 19.6154 13.4616V5.76925Z" stroke="#333333" stroke-width="1.25" stroke-linejoin="round"/>
          <path d="M5 13.4615C5 16.1137 6.05357 18.6573 7.92893 20.5326C9.8043 22.408 12.3478 23.4615 15 23.4615C17.6522 23.4615 20.1957 22.408 22.0711 20.5326C23.9464 18.6573 25 16.1137 25 13.4615M15 28.8462V25.7692" stroke="#333333" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Send Button -->
      <button 
        class="hover:opacity-90 transition-opacity"
        (click)="sendMessage()"
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="#066A9E"/>
          <path d="M20.0139 29.5L20 10.7227M27.5 17.8762L20 10.5L12.5 17.8762" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class ChatInputComponent {
  @Output() messageSent = new EventEmitter<string>();

  message = '';

  sendMessage() {
    if (this.message.trim()) {
      this.messageSent.emit(this.message);
      this.message = '';
    }
  }
}
