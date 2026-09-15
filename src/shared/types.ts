export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  user_type: 'student' | 'professional';
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description: string;
  date: string;
  payment_method: 'cash' | 'card' | 'transfer';
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  limit: number;
  period: 'weekly' | 'monthly' | 'yearly';
  spent: number;
  created_at: string;
  updated_at: string;
}

export interface MonthlyStats {
  month: string;
  total_spent: number;
  by_category: Record<string, number>;
  expense_count: number;
}

export interface BudgetProgress {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
  user_type?: 'student' | 'professional';
}

export interface JWTPayload {
  user_id: string;
  email: string;
}
