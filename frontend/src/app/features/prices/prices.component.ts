import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { PriceService } from '../../core/services/price.service';
import { Product } from '../../core/models/product.model';
import { Price, PriceRequest } from '../../core/models/price.model';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Price Management / भाव प्रबंधन</h1>
        <button (click)="showForm = !showForm"
                class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          {{ showForm ? 'View Prices' : '+ Update Prices' }}
        </button>
      </div>

      <!-- Price Update Form -->
      <div *ngIf="showForm" class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Update Product Prices / भाव अपडेट करें</h2>
        <form [formGroup]="priceForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Product *</label>
              <select formControlName="productId"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">
                  {{ product.name }} ({{ product.nameHindi }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Buying Price (₹) *</label>
              <input type="number" step="0.01" formControlName="buyingPrice"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                     placeholder="Purchase price per unit"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
              <input type="number" step="0.01" formControlName="sellingPrice"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                     placeholder="Selling price per unit"/>
            </div>
          </div>

          <div *ngIf="getProfit() !== 0" class="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700">Expected Profit per Unit:</span>
              <span class="text-lg font-semibold"
                    [class.text-green-600]="getProfit() > 0"
                    [class.text-red-600]="getProfit() < 0">
                ₹{{ getProfit() | number:'1.2-2' }}
                <span class="text-sm">({{ getProfitPercentage() | number:'1.1-1' }}%)</span>
              </span>
            </div>
          </div>

          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <div class="flex space-x-4">
            <button type="submit" [disabled]="priceForm.invalid || isLoading"
                    class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
              {{ isLoading ? 'Updating...' : 'Update Prices' }}
            </button>
            <button type="button" (click)="resetForm()"
                    class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200">
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Current Prices Table -->
      <div *ngIf="!showForm" class="bg-white rounded-xl shadow overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">Current Prices / वर्तमान भाव</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Category</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Buying Price</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit/Unit</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Margin %</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let product of products" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.nameHindi }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ product.category.name }} / {{ product.category.nameHindi }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                  {{ product.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-purple-600">
                  ₹{{ getBuyPrice(product.id) | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-orange-600">
                  ₹{{ getSellPrice(product.id) | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                  ₹{{ getProductProfit(product.id) | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ getProductMargin(product.id) | number:'1.1-1' }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="products.length === 0" class="text-center py-12 text-gray-500">
            <p>No products found. Add products first to manage prices.</p>
          </div>
        </div>
      </div>

      <!-- Price Information Card -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h3 class="text-xl font-semibold mb-3">💡 Price Management Tips / भाव प्रबंधन सुझाव</h3>
        <ul class="space-y-2 text-sm">
          <li>• Update prices regularly based on market conditions / बाजार की स्थिति के आधार पर नियमित रूप से भाव अपडेट करें</li>
          <li>• Keep buying and selling prices competitive / खरीद और बिक्री भाव प्रतिस्पर्धी रखें</li>
          <li>• Monitor profit margins on each product / प्रत्येक उत्पाद पर लाभ मार्जिन की निगरानी करें</li>
          <li>• Consider transportation and storage costs / परिवहन और भंडारण लागत पर विचार करें</li>
        </ul>
      </div>
    </div>
  `
})
export class PricesComponent implements OnInit {
  priceForm: FormGroup;
  products: Product[] = [];
  prices: Price[] = [];
  showForm = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private priceService: PriceService
  ) {
    this.priceForm = this.fb.group({
      productId: ['', Validators.required],
      buyingPrice: ['', [Validators.required, Validators.min(0.01)]],
      sellingPrice: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadPrices();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadPrices(): void {
    this.isLoading = true;
    this.priceService.getMyPrices().subscribe({
      next: (data: Price[]) => {
        this.prices = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading prices:', error);
        this.isLoading = false;
      }
    });
  }

  getProfit(): number {
    const buyPrice = this.priceForm.get('buyingPrice')?.value || 0;
    const sellPrice = this.priceForm.get('sellingPrice')?.value || 0;
    return sellPrice - buyPrice;
  }

  getProfitPercentage(): number {
    const buyPrice = this.priceForm.get('buyingPrice')?.value || 0;
    if (buyPrice === 0) return 0;
    return (this.getProfit() / buyPrice) * 100;
  }

  getBuyPrice(productId: number): number {
    const price = this.prices.find(p => p.productId === productId);
    return price ? price.buyingPrice : 0;
  }

  getSellPrice(productId: number): number {
    const price = this.prices.find(p => p.productId === productId);
    return price ? price.sellingPrice : 0;
  }

  getProductProfit(productId: number): number {
    const buyPrice = this.getBuyPrice(productId);
    const sellPrice = this.getSellPrice(productId);
    return sellPrice - buyPrice;
  }

  getProductMargin(productId: number): number {
    const buyPrice = this.getBuyPrice(productId);
    if (buyPrice === 0) return 0;
    return (this.getProductProfit(productId) / buyPrice) * 100;
  }

  onSubmit(): void {
    if (this.priceForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const priceRequest: PriceRequest = {
        productId: Number(this.priceForm.value.productId),
        buyingPrice: Number(this.priceForm.value.buyingPrice),
        sellingPrice: Number(this.priceForm.value.sellingPrice),
        effectiveDate: new Date().toISOString().split('T')[0]
      };

      this.priceService.createOrUpdatePrice(priceRequest).subscribe({
        next: (response: Price) => {
          this.isLoading = false;
          this.resetForm();
          this.loadPrices();
          this.showForm = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to update price';
        }
      });
    }
  }

  resetForm(): void {
    this.priceForm.reset();
    this.errorMessage = '';
  }
}

