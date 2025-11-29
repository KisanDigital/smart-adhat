export interface Product {
  id: number;
  name: string;
  nameHindi: string;
  category: ProductCategory;
  unit: Unit;
  description?: string;
  imageUrl?: string;
  active: boolean;
}

export enum ProductCategory {
  GRAIN = 'GRAIN',
  PULSE = 'PULSE',
  OILSEED = 'OILSEED',
  VEGETABLE = 'VEGETABLE',
  FRUIT = 'FRUIT',
  SPICE = 'SPICE',
  OTHER = 'OTHER'
}

export enum Unit {
  KG = 'KG',
  QUINTAL = 'QUINTAL',
  TON = 'TON',
  BAG = 'BAG',
  PIECE = 'PIECE'
}
