import { ITokensGenerator } from "../model/ITokens.generator";
import config from "config"
import jwt from "jsonwebtoken"

interface Ikeys {
    JWT_ACCESS_SECRET: string,
    JWT_REFRESH_SECRET: string
}

const jwtKeys:Ikeys = config.get('jwtKeys');

interface JwtPayload {
    id: string,
}

export class TokensGenerator implements ITokensGenerator {

    generate(username: string, id:string): { accessToken: string; refreshToken: string; } {

        const accessToken:string = jwt.sign({id, username}, jwtKeys.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({id, username}, jwtKeys.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {accessToken, refreshToken}
    }

    validateRefreshToken(token:string) {
        try {
            const userData = jwt.verify(token, jwtKeys.JWT_REFRESH_SECRET) as JwtPayload;
            return {id: userData.id};
        } catch (e) {
            return null;
        }
    }

    validateAccessToken(token:string){
        try {
            const userData = jwt.verify(token, jwtKeys.JWT_ACCESS_SECRET) as JwtPayload;
            console.log("DATA", userData)
            return userData.id;

        } catch (e) {
            return null;
        }
    }
}
