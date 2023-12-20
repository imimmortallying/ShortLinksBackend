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
exports.linksRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const usersLinksRepository_1 = require("../repositories/usersLinksRepository");
const authMiddleware_1 = require("../middleweres/authMiddleware");
var HTTP_Statuses;
(function (HTTP_Statuses) {
    HTTP_Statuses[HTTP_Statuses["OK_200"] = 200] = "OK_200";
    HTTP_Statuses[HTTP_Statuses["CREATED_201"] = 201] = "CREATED_201";
    HTTP_Statuses[HTTP_Statuses["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    HTTP_Statuses[HTTP_Statuses["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    HTTP_Statuses[HTTP_Statuses["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
})(HTTP_Statuses || (HTTP_Statuses = {}));
//! ошибки добавляются в массив, проверка работает корректно, но, если не указано name поле, то вернет сразу обе ошибки
// как вернуть только 1 и нужно ли?
const nameValidation = () => [
    (0, express_validator_1.body)('name').trim().not().isEmpty().withMessage('Name fields is required'),
    (0, express_validator_1.body)('name').trim().isLength({ min: 3, max: 10 }).withMessage('Name length should be from 3 to 10 characters')
];
// export const getUsersRoutes = () => {
exports.linksRouter = express_1.default.Router();
exports.linksRouter.post('/api/sendLink', 
// добавить валидацию инпута - URL
authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // достать строку из запроса
    // валидация токенов
    // или валидация фингерпринта
    // достать id юзера из локал стора или из куки?
    // по этому id сделать запрос в бд на другом слое
    try {
        const { link, authOrAnon } = req.body;
        console.log('isAuth: ', authOrAnon);
        if (authOrAnon === 'auth') {
            const userid = req.body.user.id;
            const newLinkInDB = yield usersLinksRepository_1.usersLinksRepository.pushLink(userid, link);
            return res.status(HTTP_Statuses.OK_200).json({ message: 'ссылка добавлена в массив' });
        }
        // если пользователь анонимный, то пушу ссылку в другую коллекцию
        if (authOrAnon === 'anon') {
            const { fingerprint } = req.body;
            const newLinkInDB = yield usersLinksRepository_1.usersLinksRepository.pushLink(fingerprint, link);
            return res.json({ message: 'ссылка добавлена в массив анонимного пользователя' });
        }
        // console.log('userid:', userid)
        // тут я должен проверить, анонимный пользователь отправил ссылку или нет. В зависимости от этого либо в один либо в др репоз
        res.json('не понятно, анонимный или авторизованный пользователь');
    }
    catch (e) {
        console.log(e);
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "registration error" });
    }
}));
exports.linksRouter.get('/redirect', 
// в дальнейшем достать айпи, откуда переход
// добавить +1 count
// мидлваре?
// т.к. бд организована не оптимально, то, чтобы не проводить поиск каждого alias при переходе,
// в каждой из 2-х коллекций - анонимных и авториз. пользователей,
// при создании alias добавь символ 'a'(anon) или 'l'(logined) в начало alias, чтобы 
// в этом месте проверить наличие этого символа и сделать поиск по 1 из 2 коллекий в бд
// достать alias
// сделать поиск в бд
// вернуть полную ссылку если нашлась
// если нет, то какая-то ошибка, которая на фронте отобразит, что такой ссылки нет
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { alias } = req.body;
        return res.json({ message: alias });
    }
    catch (e) {
        console.log(e);
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "id link error" });
    }
}));
