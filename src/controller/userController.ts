import { Request, Response } from 'express';
import { UserInstance } from '../model/userModel';
import { v4 as uuidv4 } from 'uuid';
import { registerUserSchema, options, loginUserSchema } from '../utils/utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TodoInstance } from '../model/todoModel';
const jwtsecret = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, firstName, phoneNumber, password, confirm_password } =
      req.body;
    const newId = uuidv4();
    // Validate with Joi
    const validationResult = registerUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ Error: validationResult.error.details[0].message });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 8);
    const confirm_passwordHash = await bcrypt.hash(confirm_password, 8);

    // Create user
    // -check if user exist
    const user = await UserInstance.findOne({
      where: { email: email },
    });

    if (!user) {
      let newUser = await UserInstance.create({
        id: newId,
        email,
        firstName,
        phoneNumber,
        password: passwordHash,
        confirm_password: confirm_passwordHash,
      });

      // Generate token for user
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as { [key: string]: string };

      const { id } = User;

      const token = jwt.sign({ id }, jwtsecret, { expiresIn: '30mins' });
      // automatically save token inside of the cookie (applies to cookies only)
      // res.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
      // otp

      // Email

      // do your response here
      return res.status(201).json({
        msg: 'user created successfully',
        newUser,
        token,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Validate with Joi
    const validationResult = loginUserSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    // Confirm/Reconfirm token of user
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as { [key: string]: string };

    const { id } = User;
    const token = jwt.sign({ id }, jwtsecret, { expiresIn: '30d' });
    // automatically save token inside of the cookie (applies to cookies only)
    // res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    const validUser = await bcrypt.compare(password, User.password);

    if (validUser) {
      return res.status(201).json({
        msg: 'You have successfully logged in',
        User,
        token,
      });
    }

    return res.status(400).json({ Error: 'Invalid email/password' });
  } catch (err) {
    console.log(err);
    // res.status(500).json({  Error: "Internal server error"})
  }
};

export const getUserAndTodo = async (req: Request, res: Response) => {
  try {
    const getAllUsers = await UserInstance.findAndCountAll({
      include: [
        {
          model: TodoInstance,
          as: 'Todos',
        },
      ],
    });

    return res.status(200).json({
      msg: 'You have successfully retrieve all data',
      count: getAllUsers.count,
      users: getAllUsers.rows,
    });
  } catch (err) {
    console.log(err);
  }
};
