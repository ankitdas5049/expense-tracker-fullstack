import { get, all, run } from '../db';
import { Category } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  { name: 'Transportation', icon: '🚗', color: '#4ECDC4' },
  { name: 'Entertainment', icon: '🎬', color: '#95E1D3' },
  { name: 'Shopping', icon: '🛍️', color: '#FFD93D' },
  { name: 'Utilities', icon: '⚡', color: '#6C5CE7' },
  { name: 'Health & Fitness', icon: '💪', color: '#A29BFE' },
  { name: 'Education', icon: '📚', color: '#74B9FF' },
  { name: 'Personal Care', icon: '💇', color: '#FD79A8' },
];

export const initializeDefaultCategories = async (userId: string): Promise<void> => {
  const existing = await all('SELECT * FROM categories WHERE user_id = ?', [userId]);
  if (existing.length > 0) return;

  for (const cat of DEFAULT_CATEGORIES) {
    const id = uuidv4();
    const now = new Date().toISOString();
    await run(
      `INSERT INTO categories (id, user_id, name, icon, color, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, userId, cat.name, cat.icon, cat.color, now]
    );
  }
};

export const getUserCategories = async (userId: string): Promise<Category[]> => {
  return all('SELECT * FROM categories WHERE user_id = ? ORDER BY name', [userId]);
};

export const createCategory = async (userId: string, name: string, icon: string, color: string): Promise<Category> => {
  const id = uuidv4();
  const now = new Date().toISOString();

  await run(
    `INSERT INTO categories (id, user_id, name, icon, color, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, userId, name, icon, color, now]
  );

  return { id, user_id: userId, name, icon, color, created_at: now };
};

export const getCategoryById = async (id: string, userId: string): Promise<Category | undefined> => {
  return get('SELECT * FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
};
