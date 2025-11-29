import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Dashboard / डैशबोर्ड</h1>
        <div class="text-sm text-gray-600">Last updated: {{ currentDate | date:'medium' }}</div>
      </div>

      <div *ngIf="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading dashboard...</p>
      </div>

      <div *ngIf="!isLoading && stats" class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Products -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm">Total Products</p>
                <h3 class="text-3xl font-bold mt-2">{{ stats.totalProducts }}</h3>
                <p class="text-blue-100 text-xs mt-1">कुल उत्पाद</p>
              </div>
              <div class="bg-blue-400 bg-opacity-50 rounded-full p-3">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Inventory Value -->
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm">Inventory Value</p>
                <h3 class="text-3xl font-bold mt-2">₹{{ stats.totalInventoryValue | number:'1.0-0' }}</h3>
                <p class="text-green-100 text-xs mt-1">स्टॉक मूल्य</p>
              </div>
              <div class="bg-green-400 bg-opacity-50 rounded-full p-3">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                  <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Today's Purchases -->
          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm">Today's Purchases</p>
                <h3 class="text-3xl font-bold mt-2">₹{{ stats.todayPurchases | number:'1.0-0' }}</h3>
                <p class="text-purple-100 text-xs mt-1">आज की खरीद</p>
              </div>
              <div class="bg-purple-400 bg-opacity-50 rounded-full p-3">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Today's Sales -->
          <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm">Today's Sales</p>
                <h3 class="text-3xl font-bold mt-2">₹{{ stats.todaySales | number:'1.0-0' }}</h3>
                <p class="text-orange-100 text-xs mt-1">आज की बिक्री</p>
              </div>
              <div class="bg-orange-400 bg-opacity-50 rounded-full p-3">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">This Month / इस महीने</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Purchases:</span>
                <span class="font-semibold text-purple-600">₹{{ stats.monthPurchases | number:'1.0-0' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Sales:</span>
                <span class="font-semibold text-orange-600">₹{{ stats.monthSales | number:'1.0-0' }}</span>
              </div>
              <div class="flex justify-between items-center pt-3 border-t">
                <span class="text-gray-700 font-medium">Profit:</span>
                <span class="font-bold text-green-600">₹{{ (stats.monthSales - stats.monthPurchases) | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Pending Payments / बाकी भुगतान</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Purchase Due:</span>
                <span class="font-semibold text-red-600">₹{{ stats.pendingPurchasePayments | number:'1.0-0' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Sale Due:</span>
                <span class="font-semibold text-green-600">₹{{ stats.pendingSalePayments | number:'1.0-0' }}</span>
              </div>
              <div class="flex justify-between items-center pt-3 border-t">
                <span class="text-gray-700 font-medium">Net Due:</span>
                <span class="font-bold" [class.text-green-600]="stats.pendingSalePayments > stats.pendingPurchasePayments"
                      [class.text-red-600]="stats.pendingSalePayments < stats.pendingPurchasePayments">
                  ₹{{ (stats.pendingSalePayments - stats.pendingPurchasePayments) | number:'1.0-0' }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Low Stock Alert / कम स्टॉक</h3>
            <div *ngIf="stats.lowStockProducts && stats.lowStockProducts.length > 0" class="space-y-2">
              <div *ngFor="let item of stats.lowStockProducts.slice(0, 3)"
                   class="flex justify-between items-center p-2 bg-red-50 rounded">
                <span class="text-sm text-gray-700">{{ item.productName }}</span>
                <span class="text-sm font-semibold text-red-600">{{ item.quantity }} {{ item.unit }}</span>
              </div>
            </div>
            <div *ngIf="!stats.lowStockProducts || stats.lowStockProducts.length === 0"
                 class="text-center text-gray-500 py-4">
              <p>All products are well stocked!</p>
              <p class="text-xs mt-1">सभी उत्पाद स्टॉक में हैं</p>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white rounded-xl shadow">
          <div class="p-6 border-b">
            <h3 class="text-xl font-semibold text-gray-800">Recent Transactions / हाल के लेन-देन</h3>
          </div>
          <div class="p-6">
            <div *ngIf="stats.recentTransactions && stats.recentTransactions.length > 0" class="space-y-3">
              <div *ngFor="let txn of stats.recentTransactions"
                   class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center"
                       [class.bg-purple-100]="txn.type === 'PURCHASE'"
                       [class.bg-orange-100]="txn.type === 'SALE'">
                    <span class="text-lg" [class.text-purple-600]="txn.type === 'PURCHASE'"
                          [class.text-orange-600]="txn.type === 'SALE'">
                      {{ txn.type === 'PURCHASE' ? '↓' : '↑' }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ txn.productName }}</p>
                    <p class="text-sm text-gray-600">{{ txn.date | date:'short' }} • {{ txn.partyName }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold" [class.text-purple-600]="txn.type === 'PURCHASE'"
                     [class.text-orange-600]="txn.type === 'SALE'">
                    ₹{{ txn.amount | number:'1.0-0' }}
                  </p>
                  <p class="text-sm text-gray-600">{{ txn.quantity }} {{ txn.unit }}</p>
                </div>
              </div>
            </div>
            <div *ngIf="!stats.recentTransactions || stats.recentTransactions.length === 0"
                 class="text-center text-gray-500 py-8">
              No recent transactions
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;
  currentDate = new Date();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading dashboard:', error);
        this.isLoading = false;
      }
    });
  }
}

