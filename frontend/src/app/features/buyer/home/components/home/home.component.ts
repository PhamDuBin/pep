import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SideMenuComponent } from '../../../../shared/components/side-menu/side-menu.component';
import { TabNavigationComponent } from '../../../../shared/components/tab-navigation/tab-navigation.component';
import { ModeSelectorComponent } from '../common/mode-selector/mode-selector.component';
import { ChatInputComponent } from '../common/chat-input/chat-input.component';
import { ProjectService } from '../../services/project.service';
import { ChatService } from '../../services/chat.service';
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
    ModeSelectorComponent,
    ChatInputComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  tabs: Tab[] = HOME_TABS;
  projects = computed(() => this.projectService.projects());
  messages = computed(() => this.chatService.messages());

  constructor(
    private projectService: ProjectService,
    private chatService: ChatService
  ) {}

  onProjectSelected(project: any) {
    this.projectService.selectProject(project.id);
  }

  onTabChange(tab: Tab) {
    console.log('Tab changed:', tab);
  }

  onMessageSent(message: string) {
    console.log('Message sent:', message);
  }
}
