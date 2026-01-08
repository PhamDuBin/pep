import { Routes } from '@angular/router';

export const VENDOR_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./layout/vender-layout.component').then(m => m.VenderLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./home/pages/home-page').then(m => m.HomePageComponent)
            },
            {
                path: 'my-page',
                loadComponent: () => import('./my-page/pages/my-page-page').then(m => m.MyPagePageComponent)
            },
            {
                path: 'user-list',
                loadComponent: () => import('./user-list/pages/user-list-page').then((m) => m.UserListPageComponent),
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    }
];
