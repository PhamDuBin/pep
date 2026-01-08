import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'buyer',
    pathMatch: 'full',
  },
  {
    path: 'buyer',
    loadChildren: () => import('./features/buyer/buyer.routes').then((m) => m.BUYER_ROUTES),
  },
  {
    path: 'vender',
    loadChildren: () => import('./features/vender/vender.routes').then((m) => m.VENDOR_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'buyer',
  },
];
