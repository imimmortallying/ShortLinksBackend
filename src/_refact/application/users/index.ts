import { UserEntity } from '../../configuration/configuration.mongo';
import MongooseUserRepository from './services/impl/user.mongo.repository';
import { IUserRepository } from './services/user.repository';

const userRepository: IUserRepository = new MongooseUserRepository(UserEntity);

export { IUserRepository } from './services/user.repository';

export {
    userRepository
};
