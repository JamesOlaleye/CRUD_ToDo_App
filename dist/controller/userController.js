"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAndTodo = exports.login = exports.register = void 0;
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const todoModel_1 = require("../model/todoModel");
const jwtsecret = process.env.JWT_SECRET;
const register = async (req, res) => {
    try {
        const { email, firstName, phoneNumber, password, confirm_password } = req.body;
        const newId = (0, uuid_1.v4)();
        // Validate with Joi
        const validationResult = utils_1.registerUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res
                .status(400)
                .json({ Error: validationResult.error.details[0].message });
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, 8);
        const confirm_passwordHash = await bcryptjs_1.default.hash(confirm_password, 8);
        // Create user
        // -check if user exist
        const user = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (!user) {
            let newUser = await userModel_1.UserInstance.create({
                id: newId,
                email,
                firstName,
                phoneNumber,
                password: passwordHash,
                confirm_password: confirm_passwordHash,
            });
            // Generate token for user
            const User = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            const { id } = User;
            const token = jsonwebtoken_1.default.sign({ id }, jwtsecret, { expiresIn: '30mins' });
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate with Joi
        const validationResult = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        // Confirm/Reconfirm token of user
        const User = (await userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        const { id } = User;
        const token = jsonwebtoken_1.default.sign({ id }, jwtsecret, { expiresIn: '30d' });
        // automatically save token inside of the cookie (applies to cookies only)
        // res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        const validUser = await bcryptjs_1.default.compare(password, User.password);
        if (validUser) {
            return res.status(201).json({
                msg: 'You have successfully logged in',
                User,
                token,
            });
        }
        return res.status(400).json({ Error: 'Invalid email/password' });
    }
    catch (err) {
        console.log(err);
        // res.status(500).json({  Error: "Internal server error"})
    }
};
exports.login = login;
const getUserAndTodo = async (req, res) => {
    try {
        const getAllUsers = await userModel_1.UserInstance.findAndCountAll({
            include: [
                {
                    model: todoModel_1.TodoInstance,
                    as: 'Todos',
                },
            ],
        });
        return res.status(200).json({
            msg: 'You have successfully retrieve all data',
            count: getAllUsers.count,
            users: getAllUsers.rows,
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.getUserAndTodo = getUserAndTodo;
