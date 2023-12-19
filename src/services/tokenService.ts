import { usersTokenRepository } from "../repositories/usersTokenRepository";

const jwt = require('jsonwebtoken');
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = require("../config");

interface tokenPayload {
    id: string,
    username: string
}

class TokenService {
    generateTokens(payload:tokenPayload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn:'30m'});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn:'30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token:string) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token:string) {
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveRefreshTokenInDB(userid:string, refreshToken:string){
        // console.log('сохранение')
        const tokenData = await usersTokenRepository.findTokenByUserid(userid)// в коллекции токенов найти юзера
        if (tokenData) {
            // если запись есть, то обновляю у нее рефреш токен
            // console.log('нашел');
            // console.log('tokenData: ', tokenData);
           return await usersTokenRepository.refreshUsersToken({id: userid, refreshToken:refreshToken});
        }
        // если токен не найден, значит это первый логин пользователя
        // console.log('не нашел')
        const token = await usersTokenRepository.createUsersToken({id: userid, refreshToken:refreshToken}) // создать в коллекции токенов новый
        return token
    }
    
    async removeTokenFromDB(refreshToken: string) {
        const tokenData = await usersTokenRepository.removeUsersToken(refreshToken);
        return tokenData;
    }

    async findTokenInDB(refreshToken: string) {
        const tokenData = await usersTokenRepository.findTokenByItself(refreshToken);
        return tokenData;
    }



}

module.exports = new TokenService();

