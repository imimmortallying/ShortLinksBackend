import mongoose from 'mongoose';
import { getModel } from '../../../../../configuration/configuration.mongo';
import { ISessionRepository } from '../models/ISession.repository';
import { ITokensGenerator } from '../../../../../infra/tokens.generator/model/ITokens.generator';
import { User } from '../../../../../domain';


export default class MongooseSessionRepository implements ISessionRepository {

    constructor(
        private sessionGenerator: ITokensGenerator,
    ) { }

    async createSession(user: User): Promise<{accessToken: string, refreshToken: string}> {

        const { accessToken, refreshToken } = this.sessionGenerator.generate(user.id, user.username)

        const newToken = await getModel<{id:string, username:string}>('token').findOneAndUpdate(
            { id: mongoose.Types.ObjectId.createFromHexString(user.id) },
            { refreshToken: refreshToken,
                expireAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // единственный вариант установки TTL, который сработал, остальные работают минуту
            },
            {
                new: true,
                upsert: true,
                
            }
        );

        return { accessToken, refreshToken }
    }

    async deleteSession(refreshToken:string): Promise<boolean> {
        const isSessionDeleted = await getModel<{refreshToken:string}>('token').deleteOne({refreshToken:refreshToken});
        return isSessionDeleted.deletedCount === 1;
    }

}
