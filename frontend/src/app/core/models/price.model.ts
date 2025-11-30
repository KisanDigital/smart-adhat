export interface Price {
  id: number;
  productId: number;
  productName: string;
  productNameHindi: string;
  productUnit: string;
  categoryName: string;
  categoryNameHindi: string;
  buyingPrice: number;
  sellingPrice: number;
  effectiveDate: string;
  notes?: string;
  active: boolean;
}

export interface PriceRequest {
  productId: number;
  buyingPrice: number;
  sellingPrice: number;
  effectiveDate: string;
  notes?: string;
}
