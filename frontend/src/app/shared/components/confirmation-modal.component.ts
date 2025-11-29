import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
           (click)="onCancel()"></div>

      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
          <!-- Icon -->
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full"
               [ngClass]="iconBackgroundClass">
            <svg class="h-6 w-6" [ngClass]="iconClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="mt-4 text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-600">{{ message }}</p>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex gap-3">
            <button type="button"
                    (click)="onCancel()"
                    class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors">
              {{ cancelText }}
            </button>
            <button type="button"
                    (click)="onConfirm()"
                    [ngClass]="confirmButtonClass"
                    class="flex-1 px-4 py-2 rounded-lg transition-colors">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() type: 'warning' | 'danger' | 'info' = 'warning';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get iconBackgroundClass(): string {
    const classes = {
      warning: 'bg-yellow-100',
      danger: 'bg-red-100',
      info: 'bg-blue-100'
    };
    return classes[this.type];
  }

  get iconClass(): string {
    const classes = {
      warning: 'text-yellow-600',
      danger: 'text-red-600',
      info: 'text-blue-600'
    };
    return classes[this.type];
  }

  get confirmButtonClass(): string {
    const classes = {
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      info: 'bg-blue-600 hover:bg-blue-700 text-white'
    };
    return classes[this.type];
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.isOpen = false;
  }

  onCancel(): void {
    this.cancelled.emit();
    this.isOpen = false;
  }
}

