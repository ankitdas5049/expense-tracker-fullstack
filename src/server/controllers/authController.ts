import { Request, Response } from 'express';
import { createUser, getUserByEmail, verifyPassword } from '../services/userService';
import { generateToken } from '../middleware/auth';
import { AppError } from '../middleware/error';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  user_type: z.enum(['student', 'professional']),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = SignupSchema.parse(req.body);
    const existing = await getUserByEmail(body.email);
    if (existing) {
      throw new AppError(400, 'Email already registered');
    }

    const user = await createUser(body.email, body.password, body.name, body.user_type);
    const token = generateToken({ user_id: user.id, email: user.email });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Signup failed' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = LoginSchema.parse(req.body);
    const user = await getUserByEmail(body.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const passwordMatch = await verifyPassword(body.password, user.password_hash);
    if (!passwordMatch) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = generateToken({ user_id: user.id, email: user.email });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Login failed' });
    }
  }
};
