import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TodoInstance } from '../model/todoModel';

export const CreateTodo = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const todoRecord = await TodoInstance.create({
      id,
      ...req.body,
      // userId: '234',
    });

    return res.status(201).json({
      msg: 'you have successfully created a todo',
      todoRecord,
    });
  } catch (err) {
    console.log(err);
  }
};
