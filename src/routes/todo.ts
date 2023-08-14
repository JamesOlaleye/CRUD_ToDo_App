import express from 'express';
import { CreateTodo } from '../controller/todoController';
import {auth} from '../middlewares/auth'
const router = express.Router();

router.post('/create', auth, CreateTodo);

export default router;
