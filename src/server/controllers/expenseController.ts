import { Request, Response } from 'express';
import * as expenseService from '../services/expenseService';
import * as categoryService from '../services/categoryService';
import { AppError } from '../middleware/error';
import { z } from 'zod';

const CreateExpenseSchema = z.object({
  category_id: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string().min(1),
  date: z.string().date(),
  payment_method: z.enum(['cash', 'card', 'transfer']),
});

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const body = CreateExpenseSchema.parse(req.body);
    const category = await categoryService.getCategoryById(body.category_id, req.user.user_id);
    if (!category) throw new AppError(404, 'Category not found');

    const expense = await expenseService.createExpense(
      req.user.user_id,
      body.category_id,
      body.amount,
      body.description,
      body.date,
      body.payment_method
    );

    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create expense' });
    }
  }
};

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const expenses = await expenseService.getUserExpenses(req.user.user_id);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const { id } = req.params;
    const expense = await expenseService.getExpenseById(id, req.user.user_id);
    if (!expense) throw new AppError(404, 'Expense not found');

    await expenseService.updateExpense(id, req.user.user_id, req.body);
    const updated = await expenseService.getExpenseById(id, req.user.user_id);
    res.status(200).json(updated);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update expense' });
    }
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const { id } = req.params;
    const expense = await expenseService.getExpenseById(id, req.user.user_id);
    if (!expense) throw new AppError(404, 'Expense not found');

    await expenseService.deleteExpense(id, req.user.user_id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  }
};

export const getMonthlyStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');
    const { year, month } = req.query;

    if (!year || !month) {
      const now = new Date();
      const y = parseInt(year as string) || now.getFullYear();
      const m = parseInt(month as string) || now.getMonth() + 1;
      const stats = await expenseService.getMonthlyStats(req.user.user_id, y, m);
      res.status(200).json(stats);
      return;
    }

    const stats = await expenseService.getMonthlyStats(
      req.user.user_id,
      parseInt(year as string),
      parseInt(month as string)
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
