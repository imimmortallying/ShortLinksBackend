import mongoose from 'mongoose';
import { getModel } from '../../../../configuration/configuration.mongo';
// import { User, UserProps } from '../../../../domain';
import { User, UserProps } from '../../../../domain';
// import { IUserRepository } from '../user.repository';
import { ITokensRepository, UserToken } from '../tokens.repository';
import { keys } from "../impl/configuration.tokens"
const jwt = require('jsonwebtoken');

export default class MongooseTokensRepository implements ITokensRepository {

    async save(userToken: UserToken): Promise<any> {
        // тут создал комплексный метод: проверка наличия токена в бд, физическое создание ч/з
        // стороннюю библиотеку, сохранение или перезапись в бд
        // возвращение обоих токенов в auth сервис. 

        const generateTokens = (payload: { id: string, username: string }) => {
            const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = keys
            const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '30m' });
            const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
            return {
                accessToken,
                refreshToken
            }
        }

        const { accessToken, refreshToken } = generateTokens({ id: userToken.id, username: userToken.username })

        const newToken = await getModel<UserToken>('token').findOneAndUpdate(
            // { id: userToken.id },
            { id: mongoose.Types.ObjectId.createFromHexString(userToken.id) },
            { refreshToken: refreshToken },
            {
                new: true,
                upsert: true,
            }
        );

        return { accessToken, refreshToken }
    }



    // createNextId(): string {
    //     return new mongoose.Types.ObjectId().toString();
    // }

    // async create(user: User): Promise<any> {
    //     await getModel<UserProps>('user').create({
    //         id: mongoose.Types.ObjectId.createFromHexString(user.id),
    //         username: user.username,
    //         password: user.password
    //     });

    //     return;
    // }

    // async exists(username: string): Promise<boolean> {
    //     const user = await getModel<UserProps>('user').exists({ username: username });

    //     return user !== null;
    // }

    // async getByUsername(username: string): Promise<User | null> {
    //     const userEntity = await getModel<UserProps>('user').findOne({ username: username });
    //     if (userEntity == null) {
    //         return null;
    //     }

    //     return new User(userEntity.id, { username: userEntity.username, password:userEntity.password });
    // }
}
