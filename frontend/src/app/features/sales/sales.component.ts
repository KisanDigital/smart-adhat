import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SaleService } from '../../core/services/sale.service';
import { ProductService } from '../../core/services/product.service';
import { InventoryService } from '../../core/services/inventory.service';
import { Sale } from '../../core/models/sale.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Sales / बिक्री</h1>
        <button (click)="showForm = !showForm"
                class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
          {{ showForm ? 'View List' : '+ New Sale' }}
        </button>
      </div>

      <!-- Sale Form -->
      <div *ngIf="showForm" class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Add New Sale / नई बिक्री जोड़ें</h2>
        <form [formGroup]="saleForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Product *</label>
              <select formControlName="productId" (change)="onProductChange()"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">
                  {{ product.name }} ({{ product.nameHindi }})
                </option>
              </select>
              <div *ngIf="availableStock !== null" class="text-xs text-gray-600 mt-1">
                Available Stock: {{ availableStock | number:'1.2-2' }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" step="0.01" formControlName="quantity"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                     placeholder="e.g., 100.50"/>
              <div *ngIf="quantityError" class="text-xs text-red-600 mt-1">
                {{ quantityError }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price Per Unit *</label>
              <input type="number" step="0.01" formControlName="pricePerUnit"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                     placeholder="₹ per unit"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Buyer Name *</label>
              <input type="text" formControlName="buyerName"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                     placeholder="Name of buyer"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Buyer Type *</label>
              <select formControlName="buyerType"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                <option value="">Select Type</option>
                <option value="MILL">Mill / मिल</option>
                <option value="TRADER">Trader / व्यापारी</option>
                <option value="OTHER_ADHAT">Other Adhat / अन्य आढ़त</option>
                <option value="RETAILER">Retailer / खुदरा विक्रेता</option>
                <option value="OTHER">Other / अन्य</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Buyer Phone</label>
              <input type="text" formControlName="buyerPhone"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                     placeholder="10-digit number"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sale Date *</label>
              <input type="date" formControlName="saleDate"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
              <input type="text" formControlName="vehicleNumber"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                     placeholder="e.g., PB10XX1234"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
              <input type="text" formControlName="billNumber"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                     placeholder="Invoice/Bill number"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Advance Received</label>
              <input type="number" step="0.01" formControlName="advanceReceived"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                     placeholder="₹ 0.00"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select formControlName="paymentStatus"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                <option value="PENDING">Pending / बाकी</option>
                <option value="PARTIAL">Partial / आंशिक</option>
                <option value="COMPLETED">Completed / पूर्ण</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea formControlName="notes" rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Additional notes..."></textarea>
          </div>

          <div *ngIf="getTotalAmount() > 0" class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <div class="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span class="text-orange-700">₹{{ getTotalAmount() | number:'1.2-2' }}</span>
            </div>
          </div>

          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <div class="flex space-x-4">
            <button type="submit" [disabled]="saleForm.invalid || isLoading || quantityError"
                    class="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
              {{ isLoading ? 'Saving...' : 'Save Sale' }}
            </button>
            <button type="button" (click)="resetForm()"
                    class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200">
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Sales List -->
      <div *ngIf="!showForm" class="bg-white rounded-xl shadow overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">Sales History / बिक्री इतिहास</h2>
        </div>

        <div *ngIf="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        </div>

        <div *ngIf="!isLoading" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let sale of sales" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ sale.saleDate | date:'dd/MM/yyyy' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ sale.product.name }}</div>
                  <div class="text-xs text-gray-500">{{ sale.product.nameHindi }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ sale.buyerName }}</div>
                  <div class="text-xs text-gray-500">{{ sale.buyerType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ sale.quantity | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ₹{{ sale.pricePerUnit | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  ₹{{ sale.totalAmount | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="{
                          'bg-green-100 text-green-800': sale.paymentStatus === 'COMPLETED',
                          'bg-yellow-100 text-yellow-800': sale.paymentStatus === 'PARTIAL',
                          'bg-red-100 text-red-800': sale.paymentStatus === 'PENDING'
                        }">
                    {{ sale.paymentStatus }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="sales.length === 0" class="text-center py-12 text-gray-500">
            <p>No sales found</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SalesComponent implements OnInit {
  saleForm: FormGroup;
  sales: Sale[] = [];
  products: Product[] = [];
  showForm = false;
  isLoading = false;
  errorMessage = '';
  availableStock: number | null = null;
  quantityError = '';

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private productService: ProductService,
    private inventoryService: InventoryService
  ) {
    this.saleForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0.01)]],
      pricePerUnit: ['', [Validators.required, Validators.min(0.01)]],
      buyerName: ['', Validators.required],
      buyerType: ['', Validators.required],
      buyerPhone: [''],
      vehicleNumber: [''],
      driverName: [''],
      driverPhone: [''],
      saleDate: [new Date().toISOString().split('T')[0], Validators.required],
      billNumber: [''],
      notes: [''],
      advanceReceived: [0],
      paymentStatus: ['PENDING']
    });

    // Watch for quantity changes to validate against stock
    this.saleForm.get('quantity')?.valueChanges.subscribe(() => {
      this.validateQuantity();
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadSales();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => this.products = data,
      error: (error: any) => console.error('Error loading products:', error)
    });
  }

  loadSales(): void {
    this.isLoading = true;
    this.saleService.getSales().subscribe({
      next: (data: any) => {
        this.sales = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading sales:', error);
        this.isLoading = false;
      }
    });
  }

  onProductChange(): void {
    const productId = this.saleForm.get('productId')?.value;
    if (productId) {
      this.inventoryService.getInventoryByProduct(productId).subscribe({
        next: (inventory: any) => {
          this.availableStock = inventory.quantity;
          this.validateQuantity();
        },
        error: () => {
          this.availableStock = 0;
          this.quantityError = 'No stock available for this product';
        }
      });
    } else {
      this.availableStock = null;
      this.quantityError = '';
    }
  }

  validateQuantity(): void {
    const quantity = this.saleForm.get('quantity')?.value;
    if (this.availableStock !== null && quantity > this.availableStock) {
      this.quantityError = `Cannot sell more than available stock (${this.availableStock})`;
    } else {
      this.quantityError = '';
    }
  }

  getTotalAmount(): number {
    const quantity = this.saleForm.get('quantity')?.value || 0;
    const price = this.saleForm.get('pricePerUnit')?.value || 0;
    return quantity * price;
  }

  onSubmit(): void {
    if (this.saleForm.valid && !this.quantityError) {
      this.isLoading = true;
      this.errorMessage = '';

      this.saleService.createSale(this.saleForm.value).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.resetForm();
          this.loadSales();
          this.showForm = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to save sale';
        }
      });
    }
  }

  resetForm(): void {
    this.saleForm.reset({
      saleDate: new Date().toISOString().split('T')[0],
      advanceReceived: 0,
      paymentStatus: 'PENDING'
    });
    this.errorMessage = '';
    this.availableStock = null;
    this.quantityError = '';
  }
}

