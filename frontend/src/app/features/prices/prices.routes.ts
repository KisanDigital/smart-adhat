import { Routes } from '@angular/router';
import { PricesComponent } from './prices.component';
import { MainLayoutComponent } from '../../shared/layouts/main-layout.component';

export const PRICE_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: PricesComponent }
    ]
  }
];

