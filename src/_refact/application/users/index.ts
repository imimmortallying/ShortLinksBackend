import { UserEntity } from '../../configuration/configuration.mongo';
import MongooseUserRepository from './impl/user.mongo.repository';

const userRepository = new MongooseUserRepository(UserEntity);

export { IUserRepository } from './services/user.repository'

export {
    userRepository,
};