"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exmpUsersRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const inputValidationMiddleware_1 = require("../middleweres/inputValidationMiddleware");
const exmpUsersRepository_1 = require("../repositories/exmpUsersRepository");
var HTTP_Statuses;
(function (HTTP_Statuses) {
    HTTP_Statuses[HTTP_Statuses["OK_200"] = 200] = "OK_200";
    HTTP_Statuses[HTTP_Statuses["CREATED_201"] = 201] = "CREATED_201";
    HTTP_Statuses[HTTP_Statuses["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    HTTP_Statuses[HTTP_Statuses["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    HTTP_Statuses[HTTP_Statuses["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
})(HTTP_Statuses || (HTTP_Statuses = {}));
const db = {
    users: [
        { id: '1', name: 'alex', specialty: 'backend' },
        { id: '2', name: 'dima', specialty: 'frontend' },
        { id: '3', name: 'putin', specialty: 'czar' },
        { id: '4', name: 'baiden', specialty: 'president' },
        { id: '5', name: 'zelensky', specialty: 'clown' },
    ]
};
//! ошибки добавляются в массив, проверка работает корректно, но, если не указано name поле, то вернет сразу обе ошибки
// как вернуть только 1 и нужно ли?
const nameValidation = () => [
    (0, express_validator_1.body)('name').trim().not().isEmpty().withMessage('Name fields is required'),
    (0, express_validator_1.body)('name').trim().isLength({ min: 3, max: 10 }).withMessage('Name length should be from 3 to 10 characters')
];
// export const getUsersRoutes = () => {
exports.exmpUsersRouter = express_1.default.Router();
exports.exmpUsersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // отсюда логику по работе с бд нужно вынести в отдельный слой - repositories
    // const foundUsers = await usersRepository.findProducts(req.query.specialty)
    let foundUsers = yield exmpUsersRepository_1.usersRepository.findUsers(req.query.specialty);
    //@ts-ignore
    res.json(foundUsers);
    //? in memory db
    // let foundUsers = db.users;
    // users?specialty=end; видимо, "end" будет query
    // if (req.query.specialty) {
    //     foundUsers = db.users.filter(user => user.specialty.indexOf(req.query.specialty) > -1) // стандартный поиск подстроки и возвращение объекта
    // }
    // res.json(foundUsers)
}));
// id URI не типизирую - всегда строка. Потом все-таки типизировал, чтобы унифицировать 
exports.exmpUsersRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield exmpUsersRepository_1.usersRepository.findUserById(req.params.id);
    //? in memory db
    // const foundUser = db.users.find(user => user.id === req.params.id)
    // в запросе я не вижу свойства params. Тогда, оно должно формироваться фреймворком исходя из эндпоинта?
    // согласно REST API, обрабатываем несуществующий эндпоинт - 404
    // if (!foundUser) {
    //     res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
    //     return;
    // }
    //@ts-ignore
    res.json(foundUser);
}));
exports.exmpUsersRouter.post('/', nameValidation(), inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // валидация
    // if (!req.body.name || !req.body.specialty) {
    //     res.sendStatus(HTTP_Statuses.BAD_REQUEST_400)
    //     return;
    // }
    //? in memory request
    // const newUser: User = {
    //     id: crypto.randomUUID(),
    //     name: req.body.name,
    //     specialty: req.body.specialty
    // }
    // db.users.push(newUser)
    //? mongodb request
    // const newUser = {
    //     name: req.body.name,
    //     specialty: 'not stated',
    //     id: 'id from react'
    // }
    const newUser = yield exmpUsersRepository_1.usersRepository.createUser(req.body.name);
    res
        .status(HTTP_Statuses.CREATED_201) // выдаю свой статус, не позволяя передавать его автоматически
        .json(newUser);
}));
// id URI не типизирую - всегда строка
exports.exmpUsersRouter.delete('/:id', (req, res) => {
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
exports.exmpUsersRouter.put('/:id', (req, res) => {
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
// return usersRouter
// }
