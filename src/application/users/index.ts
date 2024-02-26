import MongooseUserRepository from './services/impl/user.mongo.repository';
import { IUserRepository } from './services/models/IUser.repository';

const userRepository: IUserRepository = new MongooseUserRepository();

export { IUserRepository } from './services/models/IUser.repository';

export {
    userRepository
};

