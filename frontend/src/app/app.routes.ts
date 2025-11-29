import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'inventory',
    loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'purchases',
    loadChildren: () => import('./features/purchases/purchases.routes').then(m => m.PURCHASE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'sales',
    loadChildren: () => import('./features/sales/sales.routes').then(m => m.SALE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'prices',
    loadChildren: () => import('./features/prices/prices.routes').then(m => m.PRICE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
