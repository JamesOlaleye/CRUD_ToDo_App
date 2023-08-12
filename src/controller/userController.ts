import { Request, Response } from 'express';
import { UserInstance } from '../model/userModel';
import { v4 as uuidv4 } from 'uuid';
import { registerUserSchema, options } from '../utils/utils';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const jwtsecret = process.env.JWT_SECRET as string;

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, firstName, phoneNumber, password, confirm_password } =
      req.body;
    const iduuid = uuidv4();
    // Validate with Joi or zod
    const validationResult = registerUserSchema.validate(req.body, options);

    if(validationResult.error) {
      return res.status(400).json({
        Error:validationResult.error.details[0].message
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 8);

    // Create user
    // -check if user exist
    const user = await UserInstance.findOne({
      where: { email: email },
    });

    if (!user) {
      let newUser = await UserInstance.create({
        id: iduuid,
        email,
        firstName,
        phoneNumber,
        password: passwordHash
      });

    // Generate token for user
    const User = await UserInstance.findOne({
      where: {email:email}
    }) as unknown as {[key:string]:string}

    const {id} = User
    
    const token = jwt.sign({id}, jwtsecret, {expiresIn: "30mins"})

      // otp

      // Email

      // do your response here
      return res.status(201).json({
        msg: 'user created successfully',
        newUser,
        token
      });
    }
  } catch (err) {
    console.log(err);
  }
};
