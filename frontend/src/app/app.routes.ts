import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/chat/home/home.routes').then(m => m.HOME_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
