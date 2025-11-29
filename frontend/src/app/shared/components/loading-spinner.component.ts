import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="flex items-center justify-center" [ngClass]="containerClass">
      <div class="relative">
        <div class="animate-spin rounded-full border-t-2 border-b-2"
             [ngClass]="spinnerClass"
             [style.width.px]="size"
             [style.height.px]="size">
        </div>
        <p *ngIf="message" class="mt-4 text-center text-gray-600">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() show: boolean = true;
  @Input() size: number = 48;
  @Input() message: string = '';
  @Input() spinnerClass: string = 'border-green-600';
  @Input() containerClass: string = 'py-12';
}

