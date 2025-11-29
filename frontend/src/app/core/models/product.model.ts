export interface Product {
  id: number;
  name: string;
  nameHindi: string;
  category: ProductCategory;
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
  category: ProductCategory;
  unit: Unit;
  description?: string;
  imageUrl?: string;
  active?: boolean;
}

export enum ProductCategory {
  WHEAT = 'WHEAT',
  RICE = 'RICE',
  PULSES = 'PULSES',
  SARSO = 'SARSO',
  BARLEY = 'BARLEY',
  CORN = 'CORN',
  BAJRA = 'BAJRA',
  JOWAR = 'JOWAR',
  GRAM = 'GRAM',
  MOONG = 'MOONG',
  MASOOR = 'MASOOR',
  ARHAR = 'ARHAR',
  URAD = 'URAD',
  SOYBEAN = 'SOYBEAN',
  GROUNDNUT = 'GROUNDNUT',
  COTTON = 'COTTON',
  SUGARCANE = 'SUGARCANE',
  OTHER = 'OTHER'
}

export enum Unit {
  KG = 'KG',
  QUINTAL = 'QUINTAL',
  TON = 'TON',
  BAG = 'BAG',
  PIECE = 'PIECE'
}
