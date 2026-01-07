import { Routes } from '@angular/router';

export const MY_PAGE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/my-page-page').then(m => m.MyPagePageComponent)
    }
];
