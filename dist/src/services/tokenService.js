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
Object.defineProperty(exports, "__esModule", { value: true });
const usersTokenRepository_1 = require("../repositories/usersTokenRepository");
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require("../config");
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    saveRefreshTokenInDB(userid, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('сохранение')
            const tokenData = yield usersTokenRepository_1.usersTokenRepository.findTokenByUserid(userid); // в коллекции токенов найти юзера
            if (tokenData) {
                // если запись есть, то обновляю у нее рефреш токен
                // console.log('нашел');
                // console.log('tokenData: ', tokenData);
                return yield usersTokenRepository_1.usersTokenRepository.refreshUsersToken({ id: userid, refreshToken: refreshToken });
            }
            // если токен не найден, значит это первый логин пользователя
            // console.log('не нашел')
            const token = yield usersTokenRepository_1.usersTokenRepository.createUsersToken({ id: userid, refreshToken: refreshToken }); // создать в коллекции токенов новый
            return token;
        });
    }
    removeTokenFromDB(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield usersTokenRepository_1.usersTokenRepository.removeUsersToken(refreshToken);
            return tokenData;
        });
    }
    findTokenInDB(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield usersTokenRepository_1.usersTokenRepository.findTokenByItself(refreshToken);
            return tokenData;
        });
    }
}
module.exports = new TokenService();
