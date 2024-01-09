import { ISessionGenerator } from "../models/ISession.generator";
import config from "config"
import jwt from "jsonwebtoken"

interface Ikeys {
    JWT_ACCESS_SECRET: string,
    JWT_REFRESH_SECRET: string
}

const jwtKeys:Ikeys = config.get('jwtKeys');

export class SessionGenerator implements ISessionGenerator {

    generate(id: string, username: string): { accessToken: string; refreshToken: string; } {

        const accessToken:string = jwt.sign({id, username}, jwtKeys.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({id, username}, jwtKeys.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {accessToken, refreshToken}
    }
}
