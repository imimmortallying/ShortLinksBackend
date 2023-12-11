// const express = require('express');
import express from 'express';
import { exmpUsersRouter } from './routes/exmpUsersRouter';
import { authRouter } from './routes/authRouter';

const cors = require("cors"); // !middleware для избежания cors ошибки. С cors разобраться позже!

export const app = express(); // экспорт для передачи в тест




// parsing middleware, применяется при получении каждого запроса:
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)
app.use(cors())


app.use("/users", exmpUsersRouter)
app.use("/auth", authRouter)



