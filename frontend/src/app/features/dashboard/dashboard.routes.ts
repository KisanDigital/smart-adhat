import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MainLayoutComponent } from '../../shared/layouts/main-layout.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: DashboardComponent }
    ]
  }
];

