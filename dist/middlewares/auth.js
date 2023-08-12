"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
const jwtsecret = process.env.JWT_SECRET;
const auth = async (req, res, next) => {
    try {
        // Grab token from authorization header -local storage (alternatively: req.cookies.jwt)
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({ error: 'Kindly sign in as a user' });
        }
        const token = authorization.slice(7, authorization.length);
        // verify the token with or without bearer
        let verified = jsonwebtoken_1.default.verify(token, jwtsecret);
        if (!verified) {
            return res
                .status(401)
                .json({ error: "token invalid, you can't access this route" });
        }
        const { id } = verified;
        // find user by id;
        const user = await userModel_1.UserInstance.findOne({ where: { id } });
        if (!user) {
            return res.status(401).json({ error: 'kindly register/sign in as a user' });
        }
        // if user allow access
        req.user = verified;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ error: 'User not logged in' });
    }
};
exports.auth = auth;
