import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { Inventory } from '../../core/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Inventory / स्टॉक</h1>
        <button (click)="refreshInventory()"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </span>
        </button>
      </div>

      <div *ngIf="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading inventory...</p>
      </div>

      <div *ngIf="!isLoading" class="space-y-4">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 text-sm">Total Products</p>
            <h3 class="text-2xl font-bold text-gray-800 mt-2">{{ inventory.length }}</h3>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 text-sm">Total Value</p>
            <h3 class="text-2xl font-bold text-green-600 mt-2">₹{{ getTotalValue() | number:'1.0-0' }}</h3>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 text-sm">Low Stock Items</p>
            <h3 class="text-2xl font-bold text-red-600 mt-2">{{ getLowStockCount() }}</h3>
          </div>
        </div>

        <!-- Inventory Table -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Buy Price</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let item of inventory" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ item.product.name }}</div>
                  <div class="text-sm text-gray-500">{{ item.product.nameHindi }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ item.product.category.name }}</div>
                  <div class="text-sm text-gray-500">{{ item.product.category.nameHindi }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="text-sm font-semibold text-gray-900">{{ item.quantity | number:'1.2-2' }}</div>
                  <div class="text-xs text-gray-500">{{ item.product.unit }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ₹{{ item.averageBuyPrice | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                  ₹{{ item.totalValue | number:'1.0-0' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span *ngIf="isLowStock(item)"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Low Stock
                  </span>
                  <span *ngIf="!isLowStock(item)"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    In Stock
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="inventory.length === 0" class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <p class="mt-4 text-lg">No inventory items found</p>
            <p class="text-sm">Start by making a purchase to add items to inventory</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InventoryComponent implements OnInit {
  inventory: Inventory[] = [];
  isLoading = true;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.inventoryService.getInventory().subscribe({
      next: (data) => {
        this.inventory = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.isLoading = false;
      }
    });
  }

  refreshInventory(): void {
    this.loadInventory();
  }

  getTotalValue(): number {
    return this.inventory.reduce((sum, item) => sum + (item.totalValue || 0), 0);
  }

  getLowStockCount(): number {
    return this.inventory.filter(item => this.isLowStock(item)).length;
  }

  isLowStock(item: Inventory): boolean {
    if (item.minimumStockLevel) {
      return item.quantity < item.minimumStockLevel;
    }
    return item.quantity < 10; // Default threshold
  }
}
