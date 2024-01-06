import MongooseTokensRepository from './services/impl/tokens.mongo.repository';
import { ITokensRepository } from './services/tokens.repository';

const tokensRepository: ITokensRepository = new MongooseTokensRepository();

export { ITokensRepository } from './services/tokens.repository';

export {
    tokensRepository
};

