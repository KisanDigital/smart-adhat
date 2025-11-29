import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { authGuard } from '../../core/guards/auth.guard';

export const categoryRoutes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    canActivate: [authGuard]
  }
];
