import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserInstance } from '../model/userModel';
const jwtsecret = process.env.JWT_SECRET as string;

export const auth = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    /*
    //req.cookies.jwt
    const authorization = req.cookies.jwt
    if (!authorization) {
      return res.status(401).json({ error: 'Kindly sign in as a user' });
    }
    let verified = jwt.verify(authorization, jwtsecret);
  */

    // Grab token from authorization header -local storage (alternatively: req.cookies.jwt)
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({ error: 'Kindly sign in as a user' });
    }

    const token = authorization.slice(7, authorization.length);
    // verify the token with or without bearer
    let verified = jwt.verify(token, jwtsecret);

    if (!verified) {
      return res
        .status(401)
        .json({ error: "token invalid, you can't access this route" });
    }

    const { id } = verified as { [key: string]: string };

    // find user by id;
    const user = await UserInstance.findOne({ where: { id } });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'kindly register/sign in as a user' });
    }
    // if user allow access
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: 'User not logged in' });
  }
};
