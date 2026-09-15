import { get, all, run } from '../db';
import { Expense } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

export const createExpense = async (userId: string, categoryId: string, amount: number, description: string, date: string, paymentMethod: 'cash' | 'card' | 'transfer'): Promise<Expense> => {
  const id = uuidv4();
  const now = new Date().toISOString();

  await run(
    `INSERT INTO expenses (id, user_id, category_id, amount, description, date, payment_method, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, categoryId, amount, description, date, paymentMethod, now, now]
  );

  return { id, user_id: userId, category_id: categoryId, amount, description, date, payment_method: paymentMethod, created_at: now, updated_at: now };
};

export const getExpenseById = async (id: string, userId: string): Promise<Expense | undefined> => {
  return get('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
};

export const getUserExpenses = async (userId: string): Promise<Expense[]> => {
  return all('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', [userId]);
};

export const updateExpense = async (id: string, userId: string, data: Partial<Expense>): Promise<void> => {
  const updates: string[] = [];
  const values: any[] = [];
  const now = new Date().toISOString();

  if (data.category_id) {
    updates.push('category_id = ?');
    values.push(data.category_id);
  }
  if (data.amount !== undefined) {
    updates.push('amount = ?');
    values.push(data.amount);
  }
  if (data.description) {
    updates.push('description = ?');
    values.push(data.description);
  }
  if (data.date) {
    updates.push('date = ?');
    values.push(data.date);
  }
  if (data.payment_method) {
    updates.push('payment_method = ?');
    values.push(data.payment_method);
  }

  updates.push('updated_at = ?');
  values.push(now);
  values.push(id);
  values.push(userId);

  await run(`UPDATE expenses SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, values);
};

export const deleteExpense = async (id: string, userId: string): Promise<void> => {
  await run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);
};

export const getMonthlyStats = async (userId: string, year: number, month: number): Promise<any> => {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const expenses = await all(
    `SELECT e.*, c.name as category_name FROM expenses e
     JOIN categories c ON e.category_id = c.id
     WHERE e.user_id = ? AND e.date BETWEEN ? AND ?
     ORDER BY e.date DESC`,
    [userId, startDate, endDate]
  );

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const byCategory: Record<string, number> = {};

  expenses.forEach(exp => {
    byCategory[exp.category_name] = (byCategory[exp.category_name] || 0) + exp.amount;
  });

  return {
    month: `${year}-${String(month).padStart(2, '0')}`,
    total_spent: totalSpent,
    by_category: byCategory,
    expense_count: expenses.length,
    expenses,
  };
};
