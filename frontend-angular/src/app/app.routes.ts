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
    path: 'vendor',
    loadChildren: () => import('./features/vendor/vendor.routes').then((m) => m.VENDOR_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'buyer',
  },
];
