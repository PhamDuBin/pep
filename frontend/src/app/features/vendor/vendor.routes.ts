import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const VENDOR_ROUTES: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./home/pages/home-page').then(m => m.HomePageComponent)
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    }
];
