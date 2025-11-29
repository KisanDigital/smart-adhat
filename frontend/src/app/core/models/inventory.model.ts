import { Product } from './product.model';

export interface Inventory {
  id: number;
  product: Product;
  quantity: number;
  averageBuyPrice: number;
  totalValue: number;
  minimumStockLevel?: number;
  updatedAt: string;
}

