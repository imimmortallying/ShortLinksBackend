"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const app = (0, express_1.default)();
const port = 3000;
var HTTP_Statuses;
(function (HTTP_Statuses) {
    HTTP_Statuses[HTTP_Statuses["OK_200"] = 200] = "OK_200";
    HTTP_Statuses[HTTP_Statuses["CREATED_201"] = 201] = "CREATED_201";
    HTTP_Statuses[HTTP_Statuses["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    HTTP_Statuses[HTTP_Statuses["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    HTTP_Statuses[HTTP_Statuses["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
})(HTTP_Statuses || (HTTP_Statuses = {}));
// parsing middleware, применяется при получении каждого запроса:
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
app.use(cors());
const db = {
    users: [
        { id: '1', name: 'alex', specialty: 'backend' },
        { id: '2', name: 'dima', specialty: 'frontend' },
        { id: '3', name: 'putin', specialty: 'czar' },
        { id: '4', name: 'baiden', specialty: 'president' },
    ]
};
app.get('/', (req, res) => {
    const a = 5;
    if (a > 6) {
        res.send({ message: `a > 6` });
    }
    else
        res.send({ message: "a > 6" });
    // else res.json({message: "a > 6"}) // лучше вернуть так, с явным приведением
    // else res.send(404) // число вернется статусом
    // else res.sendStatus(404) // лучше писать явный код
});
app.get('/users', (req, res) => {
    let foundUsers = db.users;
    // users?specialty=end; видимо, "end" будет query
    if (req.query.specialty) {
        foundUsers = db.users.filter(user => user.specialty.indexOf(req.query.specialty) > -1); // стандартный поиск подстроки и возвращение объекта
    }
    res.json(foundUsers);
});
app.get('/users/:id', (req, res) => {
    const foundUser = db.users.find(user => user.id === req.params.id);
    // в запросе я не вижу свойства params. Тогда, оно должно формироваться фреймворком исходя из эндпоинта?
    // согласно REST API, обрабатываем несуществующий эндпоинт - 404
    if (!foundUser) {
        res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
        return;
    }
    res.json(foundUser);
});
app.post('/users', (req, res) => {
    // валидация
    if (!req.body.name || !req.body.specialty) {
        res.sendStatus(HTTP_Statuses.BAD_REQUEST_400);
        return;
    }
    const newUser = {
        id: crypto.randomUUID(),
        name: req.body.name,
        specialty: req.body.specialty
    };
    db.users.push(newUser);
    res
        .status(HTTP_Statuses.CREATED_201) // выдаю свой статус, не позволяя передавать его автоматически
        .json(newUser);
});
app.delete('/users/:id', (req, res) => {
    if (!db.users.find(user => user.id === req.params.id)) {
        res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
        return;
    }
    db.users = db.users.filter(user => user.id !== req.params.id);
    res.sendStatus(HTTP_Statuses.NO_CONTENT_204); // no content
});
app.put('/users/:id', (req, res) => {
    const foundUser = db.users.find(user => user.id === req.params.id);
    if (!foundUser) {
        res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
        return;
    }
    if (req.body.name)
        foundUser.name = req.body.name;
    if (req.body.specialty)
        foundUser.specialty = req.body.specialty;
    res.sendStatus(HTTP_Statuses.NO_CONTENT_204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//yarn nodemon --inspect index.js
//yarn add typescript ts-node @types/express @types/node -D
// ts установлен, но чтобы он работал и выдавал ошибки во время разработки, нужно проинициализировать ts в проекте: yarn tsc --init
// теперь можно вручную сказать, чтобы ts компилировался в js, тогда инспект будет работать, но чтобы каждый раз не писать yarn tsc, добавь -w
// добавляем скрипты в package.json, чтобы не писать команды вручную
//?     "dev": "nodemon .\\dist\\index.js" - зачем экранизация?
//next lesson
// чтобы из fetch промиса достать ответ, нужно res объект с каким-нибудь свойством, иначе '...' is not valid JSON
// метод send "черезчур умный" - если передам строку, он поймет, что это строка, если объект - JSON, а если просто число - вернет соответствующий ответ
// т.е 404 вернет 'not found'. Поэтому лучше писать явный код - вместе send - sendStatus
// работа с URI - /users/:id
// URI параметры - params - db.users.find(user => user.id === +req.params.id)
// работа с квери? параметрами через ? - для фильрации
// query параметры находятся в query - if (req.query.specialty)
// fetch('http://localhost:3000/users', {method: 'GET'})
// .then(res => res.json())
// .then(json => console.log(json))
// теперь метод POST:
// чтобы отправить пост, нужно при запросе отправить body, приведенное к JSON.stringify()
// body: JSON.stringify({name: 'new name'}), headers: {'content-type':'application/json'} - если запрос пустой, content-type != application/json или
// возникла ошибка, то вернется {},
// чтобы этот бади прочитать, нужно добавить middleWare - app.use(), применяемая при каждом получении
// запроса, которая каждый запрос приведет к, распарсит в объект
// fetch('http://localhost:3000/users', {method: 'POST', body:JSON.stringify({name:'trump'}), headers:{'content-type':'application/json'}})
// .then(res => res.json()) // этот метод парсит тело ответа в объект. Если просто вывести в консоль ответ, увижу весь ответ, не только тело
// .then(json => console.log(json))
//чтобы передать нужный статус, а не тот, который автоматически дает express, нужно res.status(201), затем res.json(createdUser)
// video 10
// import express, {Request, Response} from 'express'
// req:Request, res:Response - типизация req и res
// пробую получить ответ локально через другой порт - CORS. Пока устанавливаю npm i cors
// и использую как middleware
// ULBI интернет магазин
// + .env - выносим переменные окружения
