import express from 'express';
import { authenticate } from '../middleware/auth';
import * as budgetController from '../controllers/budgetController';

const router = express.Router();

router.use(authenticate);
router.post('/', budgetController.createBudget);
router.get('/', budgetController.getBudgets);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);
router.get('/:id/progress', budgetController.getBudgetProgress);

export default router;
