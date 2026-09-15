import { get, all, run } from '../db';
import { Budget } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

export const createBudget = async (userId: string, categoryId: string, limit: number, period: 'weekly' | 'monthly' | 'yearly'): Promise<Budget> => {
  const id = uuidv4();
  const now = new Date().toISOString();

  await run(
    `INSERT INTO budgets (id, user_id, category_id, limit, period, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, categoryId, limit, period, now, now]
  );

  return { id, user_id: userId, category_id: categoryId, limit, period, spent: 0, created_at: now, updated_at: now };
};

export const getUserBudgets = async (userId: string): Promise<Budget[]> => {
  return all('SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC', [userId]);
};

export const getBudgetById = async (id: string, userId: string): Promise<Budget | undefined> => {
  return get('SELECT * FROM budgets WHERE id = ? AND user_id = ?', [id, userId]);
};

export const updateBudget = async (id: string, userId: string, limit: number, period: 'weekly' | 'monthly' | 'yearly'): Promise<void> => {
  const now = new Date().toISOString();
  await run(
    'UPDATE budgets SET limit = ?, period = ?, updated_at = ? WHERE id = ? AND user_id = ?',
    [limit, period, now, id, userId]
  );
};

export const deleteBudget = async (id: string, userId: string): Promise<void> => {
  await run('DELETE FROM budgets WHERE id = ? AND user_id = ?', [id, userId]);
};

export const getBudgetProgress = async (budgetId: string, userId: string): Promise<any> => {
  const budget = await get(
    'SELECT b.*, c.name FROM budgets b JOIN categories c ON b.category_id = c.id WHERE b.id = ? AND b.user_id = ?',
    [budgetId, userId]
  );

  if (!budget) return null;

  let startDate = new Date();
  if (budget.period === 'weekly') {
    startDate.setDate(startDate.getDate() - startDate.getDay());
  } else if (budget.period === 'monthly') {
    startDate.setDate(1);
  } else {
    startDate.setMonth(0, 1);
  }

  const expenses = await all(
    'SELECT SUM(amount) as total FROM expenses WHERE user_id = ? AND category_id = ? AND date >= ?',
    [userId, budget.category_id, startDate.toISOString().split('T')[0]]
  );

  const spent = expenses[0]?.total || 0;
  const remaining = Math.max(0, budget.limit - spent);
  const percentage = Math.round((spent / budget.limit) * 100);

  return {
    category: budget.name,
    limit: budget.limit,
    spent,
    remaining,
    percentage: Math.min(percentage, 100),
  };
};
