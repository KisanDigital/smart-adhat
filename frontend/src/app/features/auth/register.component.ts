import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
      <div class="max-w-2xl w-full">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-green-700 mb-2">Register Your Adhat Shop</h1>
            <p class="text-gray-600">अपनी आढ़त की दुकान पंजीकृत करें</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
                <input type="text" formControlName="shopName"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                       [class.border-red-300]="registerForm.get('shopName')?.invalid && registerForm.get('shopName')?.touched"
                       [class.border-gray-300]="!registerForm.get('shopName')?.invalid || !registerForm.get('shopName')?.touched"
                       placeholder="e.g., Ram Lal Traders"/>
                <div *ngIf="registerForm.get('shopName')?.invalid && registerForm.get('shopName')?.touched"
                     class="text-red-500 text-xs mt-1">Required</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                <input type="text" formControlName="ownerName"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                       [class.border-red-300]="registerForm.get('ownerName')?.invalid && registerForm.get('ownerName')?.touched"
                       [class.border-gray-300]="!registerForm.get('ownerName')?.invalid || !registerForm.get('ownerName')?.touched"
                       placeholder="e.g., Ram Lal Singh"/>
                <div *ngIf="registerForm.get('ownerName')?.invalid && registerForm.get('ownerName')?.touched"
                     class="text-red-500 text-xs mt-1">Required</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input type="text" formControlName="username"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                       [class.border-red-300]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                       [class.border-gray-300]="!registerForm.get('username')?.invalid || !registerForm.get('username')?.touched"
                       placeholder="Choose a username"/>
                <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                     class="text-red-500 text-xs mt-1">Required</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password * (min 6 chars)</label>
                <input type="password" formControlName="password"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                       [class.border-red-300]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                       [class.border-gray-300]="!registerForm.get('password')?.invalid || !registerForm.get('password')?.touched"
                       placeholder="Choose a strong password"/>
                <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                     class="text-red-500 text-xs mt-1">Minimum 6 characters required</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number * (10 digits)</label>
                <input type="text" formControlName="phone"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                       [class.border-red-300]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                       [class.border-gray-300]="!registerForm.get('phone')?.invalid || !registerForm.get('phone')?.touched"
                       placeholder="10-digit mobile number"/>
                <div *ngIf="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                     class="text-red-500 text-xs mt-1">10 digits required</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" formControlName="email"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                       [class.border-red-300]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                       [class.border-gray-300]="!registerForm.get('email')?.invalid || !registerForm.get('email')?.touched"
                       placeholder="your@email.com"/>
                <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                     class="text-red-500 text-xs mt-1">Valid email required</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input type="text" formControlName="city"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                       [class.border-red-300]="registerForm.get('city')?.invalid && registerForm.get('city')?.touched"
                       [class.border-gray-300]="!registerForm.get('city')?.invalid || !registerForm.get('city')?.touched"
                       placeholder="e.g., Ludhiana"/>
                <div *ngIf="registerForm.get('city')?.invalid && registerForm.get('city')?.touched"
                     class="text-red-500 text-xs mt-1">Required</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input type="text" formControlName="state"
                       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                       [class.border-red-300]="registerForm.get('state')?.invalid && registerForm.get('state')?.touched"
                       [class.border-gray-300]="!registerForm.get('state')?.invalid || !registerForm.get('state')?.touched"
                       placeholder="e.g., Punjab"/>
                <div *ngIf="registerForm.get('state')?.invalid && registerForm.get('state')?.touched"
                     class="text-red-500 text-xs mt-1">Required</div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea formControlName="address" rows="2"
                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        [class.border-red-300]="registerForm.get('address')?.invalid && registerForm.get('address')?.touched"
                        [class.border-gray-300]="!registerForm.get('address')?.invalid || !registerForm.get('address')?.touched"
                        placeholder="Full shop address"></textarea>
              <div *ngIf="registerForm.get('address')?.invalid && registerForm.get('address')?.touched"
                   class="text-red-500 text-xs mt-1">Required</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input type="text" formControlName="gstNumber"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                       placeholder="GST Number (if applicable)"/>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input type="text" formControlName="licenseNumber"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                       placeholder="Mandi License Number"/>
              </div>
            </div>

            <div *ngIf="registerForm.invalid && (registerForm.dirty || registerForm.touched)"
                 class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
              <strong>Please fill all required fields marked with *</strong>
              <ul class="mt-2 ml-4 list-disc space-y-1">
                <li *ngIf="registerForm.get('shopName')?.invalid">Shop Name</li>
                <li *ngIf="registerForm.get('ownerName')?.invalid">Owner Name</li>
                <li *ngIf="registerForm.get('username')?.invalid">Username</li>
                <li *ngIf="registerForm.get('password')?.invalid">Password (minimum 6 characters)</li>
                <li *ngIf="registerForm.get('phone')?.invalid">Phone Number (10 digits)</li>
                <li *ngIf="registerForm.get('address')?.invalid">Address</li>
                <li *ngIf="registerForm.get('city')?.invalid">City</li>
                <li *ngIf="registerForm.get('state')?.invalid">State</li>
              </ul>
            </div>

            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {{ successMessage }}
            </div>

            <button type="submit" [disabled]="registerForm.invalid || isLoading"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50">
              <span *ngIf="!isLoading">Register / पंजीकरण करें</span>
              <span *ngIf="isLoading">Processing...</span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <a [routerLink]="['/auth/login']" class="text-green-600 hover:text-green-700 text-sm font-medium">
              Already have an account? Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      shopName: ['', Validators.required],
      ownerName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', Validators.email],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      gstNumber: [''],
      licenseNumber: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
