import express from 'express';
import { authenticate } from '../middleware/auth';
import * as expenseController from '../controllers/expenseController';

const router = express.Router();

router.use(authenticate);
router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.get('/stats/monthly', expenseController.getMonthlyStats);

export default router;
