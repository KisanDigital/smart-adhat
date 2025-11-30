import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  nameHindi: string;
  category: Category;
  unit: Unit;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequest {
  name: string;
  nameHindi: string;
  category: { id: number };
  unit: Unit;
  description?: string;
  imageUrl?: string;
  active?: boolean;
}

export enum Unit {
  KG = 'KG',
  QUINTAL = 'QUINTAL',
  TON = 'TON',
  BAG = 'BAG',
  PIECE = 'PIECE'
}
