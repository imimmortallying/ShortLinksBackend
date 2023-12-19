"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// const express = require('express');
const express_1 = __importDefault(require("express"));
const linksRouter_1 = require("./routes/linksRouter");
const authRouter_1 = require("./routes/authRouter");
exports.app = (0, express_1.default)(); // экспорт для передачи в тест
const cors = require("cors"); // !middleware для избежания cors ошибки. С cors разобраться позже!
const cookieParser = require('cookie-parser');
// parsing middleware, применяется при получении каждого запроса:
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use(cookieParser());
exports.app.use(cors({
    credentials: true,
    origin: 'http://localhost:4000'
}));
exports.app.use("/", linksRouter_1.linksRouter);
exports.app.use("/api", authRouter_1.authRouter);
