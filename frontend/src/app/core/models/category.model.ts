export interface Category {
  id: number;
  name: string;
  nameHindi: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  nameHindi: string;
  description?: string;
  active?: boolean;
}

