import { TokensGenerator } from '../../../../infra/tokens.generator/impl/tokens.generator';
import MongooseTokensRepository from './impl/session.mongo.repository';
import { ISessionRepository } from './models/ISession.repository';

const sessionGenerator: ISessionRepository = new MongooseTokensRepository(new TokensGenerator);

export { ISessionRepository } from './models/ISession.repository';

export {
    sessionGenerator
};

