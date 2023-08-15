import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TodoInstance } from '../model/todoModel';
import { createTodoSchema, options, updateTodoSchema } from '../utils/utils';

export const createTodo = async (req: Request | any, res: Response) => {
  try {
    const verified = req.user;

    const id = uuidv4();
    // Validate with Joi
    const validationResult = createTodoSchema.validate(req.body, options);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ Error: validationResult.error.details[0].message });
    }

    const todoRecord = await TodoInstance.create({
      id,
      ...req.body, // const {description, completed} = req.body
      userId: verified.id,
    });

    return res.status(201).json({
      msg: 'you have successfully created a todo',
      todoRecord,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    // limit the number of data displayed by using query param
    //e.g todos/get-todos?limit=3&offset=1
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    //sequelize findAll or findAndCountAll
    // const getAllTodos = await TodoInstance.findAll();
    const getAllTodos = await TodoInstance.findAndCountAll({
      limit: limit,
      offset: offset,
    }); //separating concerns

    return res.status(200).json({
      msg: 'You have successfully retrieve all data',
      count: getAllTodos.count, // counts and
      todo: getAllTodos.rows, // todo
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    //todos/update-todo/id
    const { id } = req.params; // or const id = req.params.id
    const { completed } = req.body;
    // Validate with Joi
    const validationResult = updateTodoSchema.validate(req.body, options);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    }

    const updateTodo = await TodoInstance.findOne({ where: { id } });

    if (!updateTodo) {
      return res.status(400).json({
        error: 'Cannot find existing todo',
      });
    }

    const updateRecord = await updateTodo.update({
      completed,
    });

    return res.status(200).json({
      msg: 'You have updated your todo',
      updateRecord,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // or const id = req.params.id
    const record = await TodoInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(400).json({
        error: 'Cannot find existing todo',
      });
    }

    const deletedRecord = await record.destroy();

    return res.status(200).json({
      msg: 'You have successfully deleted your todo',
      deletedRecord,
    });
  } catch (error) {
    console.log(error);
  }
};
