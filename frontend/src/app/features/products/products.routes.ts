import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { MainLayoutComponent } from '../../shared/layouts/main-layout.component';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: ProductsComponent }
    ]
  }
];

