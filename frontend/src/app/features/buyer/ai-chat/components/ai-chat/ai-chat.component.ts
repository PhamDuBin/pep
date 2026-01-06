import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SideMenuComponent } from '../../../../shared/components/side-menu/side-menu.component';
import { TabNavigationComponent } from '../../../../shared/components/tab-navigation/tab-navigation.component';
import { ProjectPlanModeButtonComponent } from '../../../../shared/components/project-plan-mode-button/project-plan-mode-button.component';
import { ChatMessageListComponent } from '../common/chat-message-list/chat-message-list.component';
import { ChatInputBoxComponent } from '../common/chat-input-box/chat-input-box.component';
import { AiChatService } from '../../services/ai-chat.service';
import { Tab } from '../../../home/models/tab.model';
import { AI_CHAT_TABS } from '../../constants/ai-chat-tabs.constant';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SideMenuComponent,
    TabNavigationComponent,
    ProjectPlanModeButtonComponent,
    ChatMessageListComponent,
    ChatInputBoxComponent
  ],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent implements OnInit {
  tabs: Tab[] = AI_CHAT_TABS;

  messages = computed(() => this.aiChatService.messages());
  isLoading = computed(() => this.aiChatService.isLoading());

  constructor(private aiChatService: AiChatService) {}

  ngOnInit(): void {
    // Messages are already loaded with mock data from the service
  }

  onTabChange(tab: Tab): void {
    this.tabs = this.tabs.map(t => ({
      ...t,
      isActive: t.id === tab.id
    }));

    if (tab.id === 'carry') {
      console.log('Navigate to carry page');
    }
  }

  onMessageSent(message: string): void {
    this.aiChatService.sendMessage(message).subscribe({
      next: (response) => {
        console.log('Message sent successfully:', response);
      },
      error: (error) => {
        console.error('Error sending message:', error);
      }
    });
  }

  onMicrophoneClicked(): void {
    console.log('Microphone clicked - voice input not implemented');
  }
}
