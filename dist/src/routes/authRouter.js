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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const inputValidationMiddleware_1 = require("../middleweres/inputValidationMiddleware");
const authRepository_1 = require("../repositories/authRepository");
const bcrypt = require('bcryptjs');
var HTTP_Statuses;
(function (HTTP_Statuses) {
    HTTP_Statuses[HTTP_Statuses["OK_200"] = 200] = "OK_200";
    HTTP_Statuses[HTTP_Statuses["CREATED_201"] = 201] = "CREATED_201";
    HTTP_Statuses[HTTP_Statuses["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    HTTP_Statuses[HTTP_Statuses["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    HTTP_Statuses[HTTP_Statuses["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
})(HTTP_Statuses || (HTTP_Statuses = {}));
const nameValidation = () => [
    (0, express_validator_1.body)('name').trim().not().isEmpty().withMessage('Name fields is required'),
    (0, express_validator_1.body)('name').trim().isLength({ min: 3, max: 10 }).withMessage('Name length should be from 3 to 10 characters')
];
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/registration', 
// nameValidation(), inputValidationMiddleware,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        //верну либо юзера, либо пустой массив - проверка на наличие юзера в базе
        const isUserRegistred = yield authRepository_1.authRepository.checkIsUserRegistred(username);
        if (isUserRegistred.length) {
            return res.status(HTTP_Statuses.BAD_REQUEST_400).json('Пользователь с таким именем уже существует');
        }
        //если в бд юзера нет, то создаем. Пароль шифруем
        const hashPassword = bcrypt.hashSync(password, 7);
        const newUser = {
            username: username,
            password: hashPassword,
            id: crypto.randomUUID(),
        };
        yield authRepository_1.authRepository.createNewUser(newUser);
        res.json('Пользователь успешно зарегистрирован');
    }
    catch (e) {
        console.log(e);
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "registration error" });
    }
}));
exports.authRouter.post('/login', nameValidation(), inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (e) {
        console.log(e);
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "login error" });
    }
}));
// для проверки доступа анонимного/зарег пользователей
exports.authRouter.get('/allUsers', 
// nameValidation(), inputValidationMiddleware,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json('allusers work');
    }
    catch (e) {
        console.log(e);
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "some error" });
    }
}));
