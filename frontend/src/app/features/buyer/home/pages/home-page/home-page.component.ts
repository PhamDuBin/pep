import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SideMenuComponent } from '../../../../shared/components/side-menu/side-menu.component';
import { TabNavigationComponent, Tab } from '../../../../shared/components/tab-navigation/tab-navigation.component';
import { ModeSelectorComponent } from '../../components/mode-selector/mode-selector.component';
import { ChatInputComponent } from '../../components/chat-input/chat-input.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SideMenuComponent,
    TabNavigationComponent,
    ModeSelectorComponent,
    ChatInputComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  tabs: Tab[] = [
    {
      id: 'kick',
      label: 'kick',
      subLabel: '（プロジェクト計画作成→提案依頼）',
      icon: 'kick',
      isActive: true,
      isDisabled: false
    },
    {
      id: 'carry',
      label: 'carry',
      subLabel: '（ベンダーとのコミュニケーション）',
      icon: 'carry',
      isActive: false,
      isDisabled: false
    }
  ];

  onProjectSelected(project: any) {
    console.log('Project selected:', project);
  }

  onTabChange(tab: Tab) {
    console.log('Tab changed:', tab);
  }

  onMessageSent(message: string) {
    console.log('Message sent:', message);
  }
}
