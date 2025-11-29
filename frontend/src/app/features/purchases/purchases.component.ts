import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseService } from '../../core/services/purchase.service';
import { ProductService } from '../../core/services/product.service';
import { Purchase } from '../../core/models/purchase.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Purchases / खरीद</h1>
        <button (click)="showForm = !showForm"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          {{ showForm ? 'View List' : '+ New Purchase' }}
        </button>
      </div>

      <!-- Purchase Form -->
      <div *ngIf="showForm" class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Add New Purchase / नई खरीद जोड़ें</h2>
        <form [formGroup]="purchaseForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Product *</label>
              <select formControlName="productId"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">
                  {{ product.name }} ({{ product.nameHindi }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" step="0.01" formControlName="quantity"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                     placeholder="e.g., 100.50"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price Per Unit *</label>
              <input type="number" step="0.01" formControlName="pricePerUnit"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                     placeholder="₹ per unit"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Seller Name *</label>
              <input type="text" formControlName="sellerName"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                     placeholder="Name of farmer/seller"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Seller Type *</label>
              <select formControlName="sellerType"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="">Select Type</option>
                <option value="FARMER">Farmer / किसान</option>
                <option value="MIDDLEMAN">Middleman / बिचौलिया</option>
                <option value="OTHER_ADHAT">Other Adhat / अन्य आढ़त</option>
                <option value="OTHER">Other / अन्य</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Seller Phone</label>
              <input type="text" formControlName="sellerPhone"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                     placeholder="10-digit number"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Date *</label>
              <input type="date" formControlName="purchaseDate"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
              <input type="text" formControlName="vehicleNumber"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                     placeholder="e.g., PB10XX1234"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
              <input type="text" formControlName="billNumber"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                     placeholder="Invoice/Bill number"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Advance Paid</label>
              <input type="number" step="0.01" formControlName="advancePaid"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                     placeholder="₹ 0.00"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select formControlName="paymentStatus"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="PENDING">Pending / बाकी</option>
                <option value="PARTIAL">Partial / आंशिक</option>
                <option value="COMPLETED">Completed / पूर्ण</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea formControlName="notes" rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Additional notes..."></textarea>
          </div>

          <div *ngIf="getTotalAmount() > 0" class="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div class="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span class="text-green-700">₹{{ getTotalAmount() | number:'1.2-2' }}</span>
            </div>
          </div>

          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <div class="flex space-x-4">
            <button type="submit" [disabled]="purchaseForm.invalid || isLoading"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
              {{ isLoading ? 'Saving...' : 'Save Purchase' }}
            </button>
            <button type="button" (click)="resetForm()"
                    class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200">
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Purchases List -->
      <div *ngIf="!showForm" class="bg-white rounded-xl shadow overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">Purchase History / खरीद इतिहास</h2>
        </div>

        <div *ngIf="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>

        <div *ngIf="!isLoading" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let purchase of purchases" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ purchase.purchaseDate | date:'dd/MM/yyyy' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ purchase.product.name }}</div>
                  <div class="text-xs text-gray-500">{{ purchase.product.nameHindi }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ purchase.sellerName }}</div>
                  <div class="text-xs text-gray-500">{{ purchase.sellerType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ purchase.quantity | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ₹{{ purchase.pricePerUnit | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  ₹{{ purchase.totalAmount | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="{
                          'bg-green-100 text-green-800': purchase.paymentStatus === 'COMPLETED',
                          'bg-yellow-100 text-yellow-800': purchase.paymentStatus === 'PARTIAL',
                          'bg-red-100 text-red-800': purchase.paymentStatus === 'PENDING'
                        }">
                    {{ purchase.paymentStatus }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="purchases.length === 0" class="text-center py-12 text-gray-500">
            <p>No purchases found</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PurchasesComponent implements OnInit {
  purchaseForm: FormGroup;
  purchases: Purchase[] = [];
  products: Product[] = [];
  showForm = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private productService: ProductService
  ) {
    this.purchaseForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.01)]],
      pricePerUnit: ['', [Validators.required, Validators.min(0.01)]],
      sellerName: ['', Validators.required],
      sellerType: ['', Validators.required],
      sellerPhone: [''],
      vehicleNumber: [''],
      driverName: [''],
      driverPhone: [''],
      purchaseDate: [new Date().toISOString().split('T')[0], Validators.required],
      billNumber: [''],
      notes: [''],
      advancePaid: [0],
      paymentStatus: ['PENDING']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadPurchases();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => this.products = data,
      error: (error: any) => console.error('Error loading products:', error)
    });
  }

  loadPurchases(): void {
    this.isLoading = true;
    this.purchaseService.getPurchases().subscribe({
      next: (data: any) => {
        this.purchases = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading purchases:', error);
        this.isLoading = false;
      }
    });
  }

  getTotalAmount(): number {
    const quantity = this.purchaseForm.get('quantity')?.value || 0;
    const price = this.purchaseForm.get('pricePerUnit')?.value || 0;
    return quantity * price;
  }

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.purchaseService.createPurchase(this.purchaseForm.value).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.resetForm();
          this.loadPurchases();
          this.showForm = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to save purchase';
        }
      });
    }
  }

  resetForm(): void {
    this.purchaseForm.reset({
      purchaseDate: new Date().toISOString().split('T')[0],
      advancePaid: 0,
      paymentStatus: 'PENDING'
    });
    this.errorMessage = '';
  }
}

