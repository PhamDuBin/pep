import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { SideMenuComponent } from '../../../../../shared/components/side-menu/side-menu.component';
import { TabNavigationComponent, Tab } from '../../../../../shared/components/tab-navigation/tab-navigation.component';
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
  template: `
    <div class="min-h-screen bg-white">
      <!-- Header -->
      <app-header></app-header>

      <!-- Side Menu -->
      <app-side-menu (projectSelected)="onProjectSelected($event)"></app-side-menu>

      <!-- Main Content Area -->
      <main class="ml-[197px] pt-[89px]">
        <!-- Tab Navigation -->
        <app-tab-navigation [tabs]="tabs" (tabChange)="onTabChange($event)"></app-tab-navigation>

        <!-- Content Area -->
        <div class="flex flex-col justify-between items-center px-[25px] py-[10px] min-h-[calc(100vh-89px-94px)]">
          <!-- Center Content -->
          <div class="flex flex-col items-center justify-center flex-1 gap-[20px] w-full max-w-[800px] mx-auto">
            <!-- Mode Selector -->
            <app-mode-selector></app-mode-selector>

            <!-- Chat Input -->
            <app-chat-input (messageSent)="onMessageSent($event)"></app-chat-input>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
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
