import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { Register, Login } from '../controller/userController';

/* GET home page. */
router.post('/register', Register);
router.post('/login', Login);

export default router;
