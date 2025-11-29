import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { MainLayoutComponent } from '../../shared/layouts/main-layout.component';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: InventoryComponent }
    ]
  }
];

