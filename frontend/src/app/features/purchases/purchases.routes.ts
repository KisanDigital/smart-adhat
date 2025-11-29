import { Routes } from '@angular/router';
import { PurchasesComponent } from './purchases.component';
import { MainLayoutComponent } from '../../shared/layouts/main-layout.component';

export const PURCHASE_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: PurchasesComponent }
    ]
  }
];

