export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  size?: string;
  color?: string;
  brand?: string;
  supplierId?: string;
  supplierName?: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  size?: string;
  color?: string;
  brand?: string;
  supplierId?: string;
  images?: string[];
  isActive?: boolean;
}
