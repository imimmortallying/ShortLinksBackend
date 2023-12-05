// const express = require('express');
import express from 'express';
import { getUsersRoutes } from './routes/users';


const cors = require("cors"); // !middleware для избежания cors ошибки. С cors разобраться позже!

export const app = express(); // экспорт для передачи в тест




// parsing middleware, применяется при получении каждого запроса:
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)
app.use(cors())

const usersRouter = getUsersRoutes();

app.use("/users", usersRouter)



