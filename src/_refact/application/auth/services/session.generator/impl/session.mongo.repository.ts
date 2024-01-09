import mongoose from 'mongoose';
import { getModel } from '../../../../../configuration/configuration.mongo';
import { ISessionRepository } from '../models/ISession.repository';
import { ISessionGenerator } from '../models/ISession.generator';
import { User } from '../../../../../domain';


export default class MongooseSessionRepository implements ISessionRepository {

    constructor(
        private sessionGenerator: ISessionGenerator,
    ) { }

    async createSession(user: User): Promise<any> {

        const { accessToken, refreshToken } = this.sessionGenerator.generate(user.id, user.username)

        const newToken = await getModel<{id:string, username:string}>('token').findOneAndUpdate(
            { id: mongoose.Types.ObjectId.createFromHexString(user.id) },
            { refreshToken: refreshToken,
                expireAt: Date.now() + 10 * 60 * 6000 * 24 * 30, // единственный вариант установки TTL, который сработал, остальные работают минуту
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
