import { ITokensGenerator } from "../tokens.generator";
import { keys } from "./configuration.tokens";
const jwt = require('jsonwebtoken');

export class TokensGenerator implements ITokensGenerator {
    // интерфейс принимаего и возвращаемого значения уже где-то лежит, доделай, когда наведешь порядок
    // нужен ли тут async и возврат промиса?
    generate(id: string, username: string): { accessToken: string; refreshToken: string; } {

        const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = keys
        const accessToken:string = jwt.sign({id, username}, JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign({id, username}, JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {accessToken, refreshToken}
    }
}
