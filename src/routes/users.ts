import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { Register } from '../controller/userController';

/* GET home page. */
router.post('/', Register);

export default router;
