import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createTask, getTasks, updateTask, deleteTask, getTaskSummary } from '../controllers/task.controller';

const router = Router();

router.post('/', authenticate, createTask);
router.get('/', authenticate, getTasks);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);
router.get('/summary', authenticate, getTaskSummary);

export default router;
