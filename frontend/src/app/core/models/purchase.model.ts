import { Product } from './product.model';

export interface Purchase {
  id: number;
  product: Product;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  sellerName: string;
  sellerType: SellerType;
  sellerPhone?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  purchaseDate: string;
  billNumber?: string;
  notes?: string;
  advancePaid?: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface PurchaseRequest {
  productId: number;
  quantity: number;
  pricePerUnit: number;
  sellerName: string;
  sellerType: SellerType;
  sellerPhone?: string;
  vehicleNumber?: string;
  driverName?: string;
  driverPhone?: string;
  purchaseDate: string;
  billNumber?: string;
  notes?: string;
  advancePaid?: number;
  paymentStatus?: PaymentStatus;
}

export enum SellerType {
  FARMER = 'FARMER',
  MIDDLEMAN = 'MIDDLEMAN',
  OTHER_ADHAT = 'OTHER_ADHAT',
  TRADER = 'TRADER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

