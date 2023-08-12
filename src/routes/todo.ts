import express from 'express';
import { CreateTodo } from '../controller/todoController';
const router = express.Router();

router.post('/', CreateTodo);

export default router;
