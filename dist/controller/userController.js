"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtsecret = process.env.JWT_SECRET;
const Register = async (req, res) => {
    try {
        const { email, firstName, phoneNumber, password, confirm_password } = req.body;
        const iduuid = (0, uuid_1.v4)();
        // Validate with Joi or zod
        const validationResult = utils_1.registerUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, 8);
        // Create user
        // -check if user exist
        const user = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (!user) {
            let newUser = await userModel_1.UserInstance.create({
                id: iduuid,
                email,
                firstName,
                phoneNumber,
                password: passwordHash
            });
            // Generate token for user
            const User = await userModel_1.UserInstance.findOne({
                where: { email: email }
            });
            const { id } = User;
            const token = jsonwebtoken_1.default.sign({ id }, jwtsecret, { expiresIn: "30mins" });
            // otp
            // Email
            // do your response here
            return res.status(201).json({
                msg: 'user created successfully',
                newUser,
                token
            });
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.Register = Register;
