"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// const express = require('express');
const express_1 = __importDefault(require("express"));
const cors = require("cors"); // !middleware для избежания cors ошибки. С cors разобраться позже!
exports.app = (0, express_1.default)(); // экспорт для передачи в тест
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
exports.app.use(jsonBodyMiddleware);
exports.app.use(cors());
const db = {
    users: [
        { id: '1', name: 'alex', specialty: 'backend' },
        { id: '2', name: 'dima', specialty: 'frontend' },
        { id: '3', name: 'putin', specialty: 'czar' },
        { id: '4', name: 'baiden', specialty: 'president' },
    ]
};
exports.app.get('/', (req, res) => {
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
exports.app.get('/users', (req, res) => {
    let foundUsers = db.users;
    // users?specialty=end; видимо, "end" будет query
    if (req.query.specialty) {
        foundUsers = db.users.filter(user => user.specialty.indexOf(req.query.specialty) > -1); // стандартный поиск подстроки и возвращение объекта
    }
    res.json(foundUsers);
});
// id URI не типизирую - всегда строка. Потом все-таки типизировал, чтобы унифицировать 
exports.app.get('/users/:id', (req, res) => {
    const foundUser = db.users.find(user => user.id === req.params.id);
    // в запросе я не вижу свойства params. Тогда, оно должно формироваться фреймворком исходя из эндпоинта?
    // согласно REST API, обрабатываем несуществующий эндпоинт - 404
    if (!foundUser) {
        res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
        return;
    }
    res.json(foundUser);
});
exports.app.post('/users', (req, res) => {
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
// id URI не типизирую - всегда строка
exports.app.delete('/users/:id', (req, res) => {
    if (!db.users.find(user => user.id === req.params.id)) {
        res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
        return;
    }
    db.users = db.users.filter(user => user.id !== req.params.id);
    res.sendStatus(HTTP_Statuses.NO_CONTENT_204); // no content
});
// хотя методы post и put требую одинаковые объекты, все равно разделю на сущности, потому что put может отличаться от post, например можно отправить
// не весь объект, который изменился, чтобы я тут искал изменения, а лишь принимать изменившиеся поля, тогда формы объектов put и post
// будут очевидно отличаться
exports.app.put('/users/:id', (req, res) => {
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
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
