export interface Expense {
  id: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  referenceNumber?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseRequest {
  category: string;
  amount: number;
  description?: string;
  date: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'mobile_money';
  referenceNumber?: string;
  attachments?: string[];
}
