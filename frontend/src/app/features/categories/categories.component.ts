import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Categories / श्रेणियाँ</h1>
        <button (click)="showForm = !showForm"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          {{ showForm ? 'View List' : '+ Add Category' }}
        </button>
      </div>

      <!-- Category Form -->
      <div *ngIf="showForm" class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">
          {{ editingCategory ? 'Edit Category / श्रेणी संपादित करें' : 'Add New Category / नई श्रेणी जोड़ें' }}
        </h2>
        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category Name (English) *</label>
              <input type="text" formControlName="name"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                     placeholder="e.g., Grains"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category Name (Hindi) *</label>
              <input type="text" formControlName="nameHindi"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                     placeholder="e.g., अनाज"/>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea formControlName="description" rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Category description..."></textarea>
          </div>

          <div class="flex items-center">
            <input type="checkbox" formControlName="active" id="active"
                   class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            <label for="active" class="ml-2 text-sm font-medium text-gray-700">Active</label>
          </div>

          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <div class="flex space-x-4">
            <button type="submit" [disabled]="categoryForm.invalid || isLoading"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
              {{ isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Save Category') }}
            </button>
            <button type="button" (click)="cancelEdit()"
                    class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200">
              {{ editingCategory ? 'Cancel' : 'Reset' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Categories Grid -->
      <div *ngIf="!showForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let category of categories"
             class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-800">{{ category.name }}</h3>
              <p class="text-gray-600">{{ category.nameHindi }}</p>
            </div>
            <span class="px-3 py-1 text-xs font-semibold rounded-full"
                  [ngClass]="category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ category.active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="space-y-2">
            <div *ngIf="category.description" class="text-sm text-gray-600 pb-3 border-b">
              {{ category.description }}
            </div>

            <div class="flex space-x-2 pt-3">
              <button (click)="editCategory(category)"
                      class="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                Edit
              </button>
              <button (click)="deleteCategory(category.id)"
                      class="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="categories.length === 0" class="col-span-full text-center py-12 text-gray-500">
          <p>No categories found. Add your first category!</p>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading && !showForm" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[] = [];
  showForm = false;
  isLoading = false;
  errorMessage = '';
  editingCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      nameHindi: ['', Validators.required],
      description: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const request = this.editingCategory
        ? this.categoryService.updateCategory(this.editingCategory.id, this.categoryForm.value)
        : this.categoryService.createCategory(this.categoryForm.value);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.cancelEdit();
          this.loadCategories();
          this.showForm = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to save category';
        }
      });
    }
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      nameHindi: category.nameHindi,
      description: category.description || '',
      active: category.active
    });
    this.showForm = true;
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.isLoading = true;
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadCategories();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to delete category';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingCategory = null;
    this.categoryForm.reset({ active: true });
    this.errorMessage = '';
    if (this.showForm) {
      this.showForm = false;
    }
  }
}
