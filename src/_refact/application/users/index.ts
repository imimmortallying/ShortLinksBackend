import MongooseUserRepository from './services/impl/user.mongo.repository';
import { IUserRepository } from './services/user.repository';

const userRepository: IUserRepository = new MongooseUserRepository();

export { IUserRepository } from './services/user.repository';

export {
    userRepository
};

