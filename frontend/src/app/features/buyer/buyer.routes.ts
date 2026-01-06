import { Routes } from '@angular/router';

export const BUYER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./home/pages/home-page').then((m) => m.HomePageComponent),
  },
  {
    path: 'ai-chat',
    loadComponent: () => import('./ai-chat/pages/ai-chat-page').then((m) => m.AiChatPageComponent),
  },
  {
    path: 'project-plan',
    loadComponent: () =>
      import('./project-plan/pages/project-plan-page').then((m) => m.ProjectPlanPageComponent),
  },
];
