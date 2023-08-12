"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTodo = void 0;
const uuid_1 = require("uuid");
const todoModel_1 = require("../model/todoModel");
const CreateTodo = async (req, res) => {
    try {
        const id = (0, uuid_1.v4)();
        const todoRecord = await todoModel_1.TodoInstance.create({
            id,
            ...req.body,
            // userId: '234',
        });
        return res.status(201).json({
            msg: 'you have successfully created a todo',
            todoRecord,
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.CreateTodo = CreateTodo;
