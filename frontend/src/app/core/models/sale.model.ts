export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  total: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  amountPaid?: number;
  balance?: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount?: number;
  total: number;
}

export interface SaleRequest {
  customerId?: string;
  items: SaleItemRequest[];
  taxRate?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  amountPaid?: number;
  notes?: string;
}

export interface SaleItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}
