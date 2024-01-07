import mongoose from 'mongoose';
import { getModel } from '../../../../configuration/configuration.mongo';
import { User, UserProps } from '../../../../domain';
import { IUserRepository } from '../models/IUser.repository';

export default class MongooseUserRepository implements IUserRepository {

    createNextId(): string {
        return new mongoose.Types.ObjectId().toString();
    }

    async create(user: User): Promise<any> {
        await getModel<UserProps>('user').create({
            id: mongoose.Types.ObjectId.createFromHexString(user.id),
            username: user.username,
            password: user.password
        });

        return;
    }

    async exists(username: string): Promise<boolean> {
        const user = await getModel<UserProps>('user').exists({ username: username });

        return user !== null;
    }

    async getByUsername(username: string): Promise<User | null> {
        const userEntity = await getModel<UserProps>('user').findOne({ username: username });
        if (userEntity == null) {
            return null;
        }

        return new User(userEntity.id, { username: userEntity.username, password:userEntity.password });
    }
}
