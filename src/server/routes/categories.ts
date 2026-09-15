import express from 'express';
import { authenticate } from '../middleware/auth';
import * as categoryController from '../controllers/categoryController';

const router = express.Router();

router.use(authenticate);
router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);

export default router;
