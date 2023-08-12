"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_1 = require("../controller/todoController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/', auth_1.auth, todoController_1.CreateTodo);
exports.default = router;
