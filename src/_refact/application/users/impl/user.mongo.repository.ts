import { UserEntity } from '../../../configuration/configuration.mongo';
import { User } from '../../../domain';
import { IUserRepository } from '../services/user.repository';

export default class MongooseUserRepository implements IUserRepository {
    constructor(private persister: typeof UserEntity) { }
    
    async insert(user: User): Promise<any> {
        const newUserEntity = await this.persister.create({
            username: user.username,
            password: user.password
        });
        
        user.id = newUserEntity.id;
        
        return;
    }
    
    async exists(username: string): Promise<boolean> {
        const user = await this.persister.exists({ username: username });

        return user !== null;
    }

    async getByUsername(username: string): Promise<User | null> {
        const userEntity = await this.persister.findOne({ username: username }).exec();

        if (userEntity == null) {
            return null;
        }

        return new User({
            username: userEntity.username,
            password: userEntity.password
        }, userEntity.id)
    }
}
