import { Product } from './product.model';

export interface Sale {
  id: number;
  product: Product;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  buyerName: string;
  buyerType: BuyerType;
  buyerPhone?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  saleDate: string;
  billNumber?: string;
  notes?: string;
  advanceReceived?: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface SaleRequest {
  productId: number;
  quantity: number;
  pricePerUnit: number;
  buyerName: string;
  buyerType: BuyerType;
  buyerPhone?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  saleDate: string;
  billNumber?: string;
  notes?: string;
  advanceReceived?: number;
  paymentStatus?: PaymentStatus;
}

export enum BuyerType {
  MILL = 'MILL',
  TRADER = 'TRADER',
  OTHER_ADHAT = 'OTHER_ADHAT',
  WHOLESALER = 'WHOLESALER',
  EXPORTER = 'EXPORTER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

