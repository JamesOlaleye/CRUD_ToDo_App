import express from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controller/todoController';
import {auth} from '../middlewares/auth'
const router = express.Router();

router.post('/create', auth, createTodo);

router.get('/get-todos', auth, getTodos);

// router.put('/update-todos', auth, updateTodo)
router.patch('/update-todos/:id', auth, updateTodo)

router.delete('/delete-todos/:id', auth, deleteTodo)

export default router;
