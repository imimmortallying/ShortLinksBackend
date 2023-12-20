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
const authMiddleware_1 = require("../middleweres/authMiddleware");
const { secret } = require("../config");
const bcrypt = require('bcryptjs');
//jwt token
const jwt = require('jsonwebtoken');
// const generateAccessToken = (id:string) => {
//     const payload = {
//         id
//     }
// payload - то, что содержит токен. sectet - ключ (рандомный?). Правильно ли его хранить тут просто файлом?
//     return jwt.sign(payload, secret, {expiresIn: '24h'})
// }
// класс с 2 токенами
const tokenService = require('../services/tokenService');
var HTTP_Statuses;
(function (HTTP_Statuses) {
    HTTP_Statuses[HTTP_Statuses["OK_200"] = 200] = "OK_200";
    HTTP_Statuses[HTTP_Statuses["CREATED_201"] = 201] = "CREATED_201";
    HTTP_Statuses[HTTP_Statuses["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    HTTP_Statuses[HTTP_Statuses["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    HTTP_Statuses[HTTP_Statuses["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
})(HTTP_Statuses || (HTTP_Statuses = {}));
const nameValidation = () => [
    (0, express_validator_1.body)('username').trim().not().isEmpty().withMessage('Username field is required'),
    (0, express_validator_1.body)('username').trim().isLength({ min: 3, max: 10 }).withMessage('Username length should be from 3 to 10 characters'),
];
const passwordValidation = () => [
    (0, express_validator_1.body)('password').trim().not().isEmpty().withMessage('Password field is required'),
    (0, express_validator_1.body)('password').trim().isLength({ min: 3, max: 10 }).withMessage('Password length should be from 3 to 10 characters')
];
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/registration', nameValidation(), passwordValidation(), inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.authRouter.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        // console.log(refreshToken)
        const token = yield tokenService.removeTokenFromDB(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token);
    }
    catch (e) {
        console.log('ошибка при logout', e);
    }
}));
exports.authRouter.get('/refresh', 
// в чем суть этого эндпоинта?
// это эндпоинт, переход на который будет происходить автоматически при истечении access токена?
// т.е каждые 30 минут будет res ошибка, которая автоматически перехватывается и создается новый токен?
//! я что-то понимаю неправильно. Это не может быть эндпоинт обновления access токена, потому что тут обновляются
// оба токена как при логине т.е. рефреш токен опять становится 30 дней. Значит, это все-таки эндпоинт, на который клиент должен попасть
// когда истекает 30 дней, чтобы автоматически проверить, был ли такой токен и валиден ли он, если да, то обновляю его
// и клиент опять имеет свежий токен на 30 дней, без необходимсоти повторной авторизации?
// но все-таки улби использует этот эндпоинт для того, чтобы перезаписать токены после истчения access токена. Но нахуя перезаписывать 
// и refresh токен? 
// если не обновлять всё пару, то 30 дней я смогу перезаписывать access токен, но через 30 дней должен буду входить в аккаунт заново
// если же я в течение 30 дней пользовался ресурсом, то мертвый access токен обновится, и не будет необходимсоти перезаходить в аккаунт
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.json({ message: 'refresh, пользователь не авторизован, пустые cookie' });
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        // console.log('ищет по токену', refreshToken)
        const tokenFromDB = yield tokenService.findTokenInDB(refreshToken);
        // console.log('нашел по токену', tokenFromDB)
        // если рефреш токен не прошел валидацию, значит истек его срок. Если токен не найден, значит не авторизован?
        // в любом случае необходима авторизация. Должен ли я в этот момент загрузить клиенту /login?
        if (!userData || !tokenFromDB) {
            return res.json({ message: 'refresh, пользователь не авторизован' });
        }
        // нахожу юзера в бд при помощи ID, которое достаю из токена. Если в бд автоматически что-то изменилось, например username,
        // то я это новое содержимое запишу в токен
        const foundUser = yield authRepository_1.authRepository.findUserById(userData.id);
        // создаю новую пару токенов, рефреш токен сохраняю в бд
        const tokens = tokenService.generateTokens({ id: userData.id, username: foundUser[0].username });
        yield tokenService.saveRefreshTokenInDB(userData.id, tokens.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.json({ accessToken: tokens.accessToken, username: userData.username });
    }
    catch (e) {
        console.log('ошибка при refresh', e);
    }
}));
exports.authRouter.post('/login', nameValidation(), passwordValidation(), inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const foundUser = yield authRepository_1.authRepository.findUserByUsername(username);
        if (!foundUser.length) {
            return res.status(HTTP_Statuses.BAD_REQUEST_400).json(`Пользователь с именем ${username} не существует`);
        }
        // console.log(foundUser)
        //спопоставление пароля - того, что отправлен, с тем, что хранится в бд. Правильно ли делать ее тут, а не при помощи бд?
        const validPassword = bcrypt.compareSync(password, foundUser[0].password);
        if (!validPassword) {
            return res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "Введен неправильный пароль" });
        }
        // const token = generateAccessToken(foundUser[0].id);
        const tokens = tokenService.generateTokens({ id: foundUser[0].id, username: foundUser[0].username });
        // сохранение рефреш токена в коллекции токенов
        yield tokenService.saveRefreshTokenInDB(foundUser[0].id, tokens.refreshToken);
        // сохранение рефреш токена в куки на 30 дней - срок как у самого токена
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.json({ accessToken: tokens.accessToken, username: foundUser[0].username });
    }
    catch (e) {
        console.log(e);
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "login error" });
    }
}));
// для проверки доступа анонимного/зарег пользователей
exports.authRouter.get('/links', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ links: 'links' });
    }
    catch (e) {
        console.log(e);
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "some error" });
    }
}));
