import { Request, Response } from 'express';
import * as budgetService from '../services/budgetService';
import * as categoryService from '../services/categoryService';
import { AppError } from '../middleware/error';
import { z } from 'zod';

const CreateBudgetSchema = z.object({
  category_id: z.string().uuid(),
  limit: z.number().positive(),
  period: z.enum(['weekly', 'monthly', 'yearly']),
});

export const createBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const body = CreateBudgetSchema.parse(req.body);
    const category = await categoryService.getCategoryById(body.category_id, req.user.user_id);
    if (!category) throw new AppError(404, 'Category not found');

    const budget = await budgetService.createBudget(
      req.user.user_id,
      body.category_id,
      body.limit,
      body.period
    );

    res.status(201).json(budget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create budget' });
    }
  }
};

export const getBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const budgets = await budgetService.getUserBudgets(req.user.user_id);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

export const updateBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const { id } = req.params;
    const { limit, period } = req.body;

    const budget = await budgetService.getBudgetById(id, req.user.user_id);
    if (!budget) throw new AppError(404, 'Budget not found');

    await budgetService.updateBudget(id, req.user.user_id, limit, period);
    const updated = await budgetService.getBudgetById(id, req.user.user_id);
    res.status(200).json(updated);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update budget' });
    }
  }
};

export const deleteBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const { id } = req.params;
    const budget = await budgetService.getBudgetById(id, req.user.user_id);
    if (!budget) throw new AppError(404, 'Budget not found');

    await budgetService.deleteBudget(id, req.user.user_id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete budget' });
    }
  }
};

export const getBudgetProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const { id } = req.params;
    const progress = await budgetService.getBudgetProgress(id, req.user.user_id);
    if (!progress) throw new AppError(404, 'Budget not found');
    res.status(200).json(progress);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch budget progress' });
    }
  }
};
