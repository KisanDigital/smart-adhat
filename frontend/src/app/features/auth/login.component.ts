import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-green-700 mb-2">Smart Adhat</h1>
            <p class="text-gray-600">Digital Mandi Management System</p>
            <p class="text-sm text-gray-500 mt-1">डिजिटल मंडी प्रबंधन प्रणाली</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Username / यूज़रनेम
              </label>
              <input
                type="text"
                formControlName="username"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your username"
              />
              <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                   class="text-red-500 text-sm mt-1">
                Username is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Password / पासवर्ड
              </label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                   class="text-red-500 text-sm mt-1">
                Password is required
              </div>
            </div>

            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Login / लॉगिन</span>
              <span *ngIf="isLoading">Loading...</span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <a [routerLink]="['/auth/register']" class="text-green-600 hover:text-green-700 text-sm font-medium">
              Don't have an account? Register here / नया खाता बनाएं
            </a>
          </div>
        </div>

        <div class="mt-6 text-center text-sm text-gray-600">
          <p>© 2025 Smart Adhat. All rights reserved.</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}
