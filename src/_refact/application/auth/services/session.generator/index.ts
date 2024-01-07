import { SessionGenerator } from './impl/session.generator';
import MongooseTokensRepository from './impl/session.mongo.repository';
import { ISessionRepository } from './models/ISession.repository';

const sessionGenerator: ISessionRepository = new MongooseTokensRepository(new SessionGenerator);

export { ISessionRepository } from './models/ISession.repository';

export {
    sessionGenerator
};

