import { TokensGenerator } from './services/impl/tokens.generator';
import MongooseTokensRepository from './services/impl/tokens.mongo.repository';
import { ITokensRepository } from './services/tokens.repository';

const tokensRepository: ITokensRepository = new MongooseTokensRepository(new TokensGenerator);

export { ITokensRepository } from './services/tokens.repository';

export {
    tokensRepository
};

