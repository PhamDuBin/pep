import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SideMenuComponent } from '../../../../shared/components/side-menu/side-menu.component';
import { TabNavigationComponent } from '../../../../shared/components/tab-navigation/tab-navigation.component';
import { ProjectPlanModeButtonComponent } from '../../../../shared/components/project-plan-mode-button/project-plan-mode-button.component';
import { ChatInputComponent } from '../common/chat-input/chat-input.component';
import { ProjectService } from '../../services/project.service';
import { AiChatService } from '../../../ai-chat/services/ai-chat.service';
import { Tab } from '../../models/tab.model';
import { HOME_TABS } from '../../constants/tabs.constant';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SideMenuComponent,
    TabNavigationComponent,
    ProjectPlanModeButtonComponent,
    ChatInputComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tabs: Tab[] = HOME_TABS;
  projects = computed(() => this.projectService.projects());

  constructor(
    private projectService: ProjectService,
    private aiChatService: AiChatService,
    private router: Router
  ) {}

  onProjectSelected(project: any) {
    this.projectService.selectProject(project.id);
  }

  onTabChange(tab: Tab) {
    if (tab.id === 'carry') {
      // Navigate to carry (communication) page when implemented
      console.log('Navigate to carry page');
    }
  }

  onMessageSent(message: string) {
    // Clear existing messages and send the new message
    this.aiChatService.clearMessages();
    this.aiChatService.sendMessage(message).subscribe();

    // Navigate to AI Chat page
    this.router.navigate(['/buyer/ai-chat']);
  }
}
