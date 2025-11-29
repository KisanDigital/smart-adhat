import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Products / उत्पाद</h1>
        <button (click)="showForm = !showForm"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          {{ showForm ? 'View List' : '+ Add Product' }}
        </button>
      </div>

      <!-- Product Form -->
      <div *ngIf="showForm" class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Add New Product / नया उत्पाद जोड़ें</h2>
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Product Name (English) *</label>
              <input type="text" formControlName="name"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                     placeholder="e.g., Wheat"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Product Name (Hindi) *</label>
              <input type="text" formControlName="nameHindi"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                     placeholder="e.g., गेहूं"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select formControlName="category"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                <option value="GRAIN">Grain / अनाज</option>
                <option value="PULSE">Pulse / दाल</option>
                <option value="OILSEED">Oilseed / तिलहन</option>
                <option value="VEGETABLE">Vegetable / सब्जी</option>
                <option value="FRUIT">Fruit / फल</option>
                <option value="SPICE">Spice / मसाला</option>
                <option value="OTHER">Other / अन्य</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select formControlName="unit"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Unit</option>
                <option value="QUINTAL">Quintal / क्विंटल</option>
                <option value="KG">Kilogram / किलो</option>
                <option value="TON">Ton / टन</option>
                <option value="BAG">Bag / बोरी</option>
                <option value="PIECE">Piece / पीस</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea formControlName="description" rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional product details..."></textarea>
          </div>

          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <div class="flex space-x-4">
            <button type="submit" [disabled]="productForm.invalid || isLoading"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
              {{ isLoading ? 'Saving...' : 'Save Product' }}
            </button>
            <button type="button" (click)="resetForm()"
                    class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200">
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Products Grid -->
      <div *ngIf="!showForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let product of products"
             class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-800">{{ product.name }}</h3>
              <p class="text-gray-600">{{ product.nameHindi }}</p>
            </div>
            <span class="px-3 py-1 text-xs font-semibold rounded-full"
                  [ngClass]="getCategoryClass(product.category)">
              {{ product.category }}
            </span>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Unit:</span>
              <span class="font-medium">{{ product.unit }}</span>
            </div>
            <div *ngIf="product.description" class="text-sm text-gray-600 pt-2 border-t">
              {{ product.description }}
            </div>
          </div>
        </div>

        <div *ngIf="products.length === 0" class="col-span-full text-center py-12 text-gray-500">
          <p>No products found. Add your first product!</p>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
  showForm = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      nameHindi: ['', Validators.required],
      category: ['', Validators.required],
      unit: ['', Validators.required],
      description: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.productService.createProduct(this.productForm.value).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.resetForm();
          this.loadProducts();
          this.showForm = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to save product';
        }
      });
    }
  }

  resetForm(): void {
    this.productForm.reset({ active: true });
    this.errorMessage = '';
  }

  getCategoryClass(category: ProductCategory): string {
    switch (category) {
      case ProductCategory.GRAIN:
        return 'bg-green-100 text-green-800';
      case ProductCategory.PULSE:
        return 'bg-yellow-100 text-yellow-800';
      case ProductCategory.OILSEED:
        return 'bg-purple-100 text-purple-800';
      case ProductCategory.VEGETABLE:
        return 'bg-blue-100 text-blue-800';
      case ProductCategory.FRUIT:
        return 'bg-red-100 text-red-800';
      case ProductCategory.SPICE:
        return 'bg-orange-100 text-orange-800';
      case ProductCategory.OTHER:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
