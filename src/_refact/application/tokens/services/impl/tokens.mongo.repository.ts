import mongoose from 'mongoose';
import { getModel } from '../../../../configuration/configuration.mongo';
import { ITokensRepository, UserToken } from '../tokens.repository';
import { ITokensGenerator } from '../tokens.generator';


export default class MongooseTokensRepository implements ITokensRepository {

    constructor(
        private tokensGenerator: ITokensGenerator,
    ) { }

    async save(userToken: UserToken): Promise<any> {

        const { accessToken, refreshToken } = this.tokensGenerator.generate(userToken.id, userToken.username)

        const newToken = await getModel<UserToken>('token').findOneAndUpdate(
            { id: mongoose.Types.ObjectId.createFromHexString(userToken.id) },
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
