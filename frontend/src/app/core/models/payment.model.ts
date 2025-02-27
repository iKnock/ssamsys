export interface Payment {
  id: string;
  referenceId: string;
  referenceType: 'sale' | 'purchase';
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  referenceId: string;
  referenceType: 'sale' | 'purchase';
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  transactionId?: string;
  notes?: string;
}
