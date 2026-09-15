import { get, all, run } from '../db';
import { User } from '../../shared/types';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (email: string, password: string, name: string, userType: 'student' | 'professional'): Promise<User> => {
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  await run(
    `INSERT INTO users (id, email, password_hash, name, user_type, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, email, passwordHash, name, userType, now, now]
  );

  return { id, email, password_hash: passwordHash, name, user_type: userType, created_at: now, updated_at: now };
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  return get('SELECT * FROM users WHERE email = ?', [email]);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  return get('SELECT * FROM users WHERE id = ?', [id]);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
