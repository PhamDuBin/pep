import { Routes } from '@angular/router';

export const BUYER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/buyer-layout.component').then((m) => m.BuyerLayoutComponent),
    children: [
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
      {
        path: 'carry',
        loadComponent: () => import('./carry/pages/carry-page').then((m) => m.CarryPageComponent),
      },
      {
        path: 'archive',
        loadComponent: () => import('./archive/pages/archive-page').then((m) => m.ArchivePageComponent),
      },
      {
        path: 'my-page',
        loadComponent: () => import('./my-page/pages/my-page-page').then((m) => m.MyPagePageComponent),
      },
      {
        path: 'user-list',
        loadComponent: () => import('./user-list/pages/user-list-page').then((m) => m.UserListPageComponent),
      },
    ],
  },
];
