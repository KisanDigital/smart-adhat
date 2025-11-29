import { Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { MainLayoutComponent } from '../../shared/layouts/main-layout.component';

export const SALE_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: SalesComponent }
    ]
  }
];

