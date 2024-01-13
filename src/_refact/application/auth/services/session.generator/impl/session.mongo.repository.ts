import mongoose from 'mongoose';
import { getModel } from '../../../../../configuration/configuration.mongo';
import { ISessionRepository } from '../models/ISession.repository';
import { User } from '../../../../../domain';

interface ISessionProps {
    id: string,
    refreshToken: string
}

export default class MongooseSessionRepository implements ISessionRepository {

    async createSession(id:string, refreshToken: string): Promise<void> {

        const newToken = await getModel<ISessionProps>('token').findOneAndUpdate(
            { id: mongoose.Types.ObjectId.createFromHexString(id) },
            { refreshToken: refreshToken,
                expireAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // единственный вариант установки TTL, который сработал, остальные работают минуту
            },
            {
                new: true,
                upsert: true,
                
            }
        );

        return;
    }

    async deleteSession(refreshToken:string): Promise<boolean> {
        const isSessionDeleted = await getModel<{refreshToken:string}>('token').deleteOne({refreshToken:refreshToken});
        return isSessionDeleted.deletedCount === 1;
    }

    async findSession (refreshToken:string): Promise<boolean> {
        const foundSession = await getModel<ISessionProps>('token').exists({ refreshToken:refreshToken});
        return foundSession !== null
    }

}
