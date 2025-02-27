export interface InventoryTransaction {
  id: string;
  productId: string;
  productName?: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unitCost?: number;
  totalCost?: number;
  reason?: string;
  referenceId?: string;
  referenceType?: 'purchase' | 'sale' | 'adjustment';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransactionRequest {
  productId: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  unitCost?: number;
  reason?: string;
  referenceId?: string;
  referenceType?: 'purchase' | 'sale' | 'adjustment';
}
