"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// const express = require('express');
const express_1 = __importDefault(require("express"));
const exmpUsersRouter_1 = require("./routes/exmpUsersRouter");
const authRouter_1 = require("./routes/authRouter");
const cors = require("cors"); // !middleware для избежания cors ошибки. С cors разобраться позже!
exports.app = (0, express_1.default)(); // экспорт для передачи в тест
// parsing middleware, применяется при получении каждого запроса:
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use(cors());
exports.app.use("/users", exmpUsersRouter_1.exmpUsersRouter);
exports.app.use("/auth", authRouter_1.authRouter);