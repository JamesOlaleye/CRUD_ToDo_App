import express from 'express';
import { register, login, getUserAndTodo } from '../controller/userController';

const router = express.Router();
/* GET home page. */
router.post('/register', register);
router.post('/login', login);
router.get('/get-user', getUserAndTodo);

export default router;
