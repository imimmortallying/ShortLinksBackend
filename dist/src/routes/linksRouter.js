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
// id URI не типизирую - всегда строка. Потом все-таки типизировал, чтобы унифицировать 
exports.linksRouter.post('/sendLink', 
// добавить валидацию инпута - URL
authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // достать строку из запроса
    // валидация токенов
    // достать id юзера из локал стора или из куки?
    // по этому id сделать запрос в бд на другом слое
    try {
        const { link } = req.body;
        console.log(link);
        const userid = req.body.user.id;
        console.log('userid:', userid);
        // тут я должен проверить, анонимный пользователь отправил ссылку или нет. В зависимости от этого либо в один либо в др репоз
        const isUserRegistred = yield usersLinksRepository_1.usersLinksRepository.pushLink(userid, link);
        res.json('Пользователь успешно зарегистрирован');
    }
    catch (e) {
        console.log(e);
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "registration error" });
    }
}));
exports.linksRouter.get('/allLinks');
