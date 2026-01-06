import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/buyer/home/home.routes').then(m => m.HOME_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
