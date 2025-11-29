import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="fixed inset-y-0 left-0 w-64 bg-green-800 text-white transform transition-transform duration-200 ease-in-out z-30">
        <div class="flex items-center justify-center h-16 bg-green-900">
          <h1 class="text-2xl font-bold">Smart Adhat</h1>
        </div>

        <nav class="mt-8">
          <a routerLink="/dashboard" routerLinkActive="bg-green-700"
             class="flex items-center px-6 py-3 hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Dashboard / डैशबोर्ड
          </a>

          <a routerLink="/inventory" routerLinkActive="bg-green-700"
             class="flex items-center px-6 py-3 hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            Inventory / स्टॉक
          </a>

          <a routerLink="/purchases" routerLinkActive="bg-green-700"
             class="flex items-center px-6 py-3 hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Purchases / खरीद
          </a>

          <a routerLink="/sales" routerLinkActive="bg-green-700"
             class="flex items-center px-6 py-3 hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Sales / बिक्री
          </a>

          <a routerLink="/products" routerLinkActive="bg-green-700"
             class="flex items-center px-6 py-3 hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            Products / उत्पाद
          </a>

          <a routerLink="/prices" routerLinkActive="bg-green-700"
             class="flex items-center px-6 py-3 hover:bg-green-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Prices / भाव
          </a>
        </nav>

        <div class="absolute bottom-0 w-full p-4">
          <button (click)="logout()"
                  class="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="ml-64">
        <!-- Header -->
        <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h2 class="text-xl font-semibold text-gray-800">{{ currentUser?.shopName }}</h2>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{{ currentUser?.ownerName }}</span>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

