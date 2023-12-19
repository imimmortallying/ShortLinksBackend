// const express = require('express');
import express from 'express';
import { linksRouter } from './routes/linksRouter';
import { authRouter } from './routes/authRouter';

export const app = express(); // экспорт для передачи в тест
const cors = require("cors"); // !middleware для избежания cors ошибки. С cors разобраться позже!
const cookieParser = require('cookie-parser');




// parsing middleware, применяется при получении каждого запроса:
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:4000'
}));


app.use("/", linksRouter);
app.use("/api", authRouter);



