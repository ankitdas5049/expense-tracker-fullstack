import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';
import { AppError } from '../middleware/error';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const categories = await categoryService.getUserCategories(req.user.user_id);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const { name, icon, color } = req.body;

    if (!name || !icon || !color) {
      throw new AppError(400, 'Missing required fields');
    }

    const category = await categoryService.createCategory(req.user.user_id, name, icon, color);
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
};
