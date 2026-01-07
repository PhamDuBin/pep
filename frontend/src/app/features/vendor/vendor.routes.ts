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
                path: 'my-page',
                loadChildren: () => import('./my-page/my-page.routes').then(m => m.MY_PAGE_ROUTES)
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    }
];
