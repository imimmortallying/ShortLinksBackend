import mongoose, { Model, Mongoose, Schema } from 'mongoose';
import { IUserProps } from '../domain/user.model';
import { ISessionProps } from '../application/auth/services/session.generator/models/ISession.repository';
import { ILinkProps } from '../domain/link.model';

const entitySchemas = new Map<string, Schema>();

entitySchemas.set('user', new Schema<IUserProps>({
    username: String,
    password: String
}));

interface ILinkPropsWithTTL extends ILinkProps {
    expireAt: Date,
    createdAt: Date,
}

entitySchemas.set('link', new Schema<ILinkPropsWithTTL>({
    alias: String,
    original: String,
    owner: String,
    expireAt: {
        type: Date,
        default: undefined, 
    },
    createdAt: {
        type: Date,
        default: undefined, 
    },
}));

entitySchemas.set('token', new Schema<ISessionProps>({
    id: String,
    refreshToken: String,
    expireAt: {
        type: Date,
        default: undefined // единственный вариант установки TTL, который сработал, остальные работают минуту
        // можно попробовать вынести в переменную. Тогда не забудь указать тут, при создании документа и при создании токена в генераторе одинаковые значения
        // по заданию время для ссылок должно задаваться относительно какого-то абсолютного времени дня, не забудь
    }
}));

const entityModels = new Map<string, Model<any>>;

const setupModel = <TSchema extends Schema = any>(
    connection: Mongoose, name: string, schema: TSchema
) => {
    return connection.model(name, schema);
};

export const createMongooseConnectionPool = (): Promise<Mongoose> => {
    // mongoose.connect('mongodb://127.0.0.1/tokens');
    
    return mongoose.connect('mongodb://127.0.0.1/users');
};

/* export const createMongoSession = (): Promise<ClientSession> => {
    return mongoose.startSession();
} */

export const getModel = <TEntity>(name: string): Model<TEntity> => {
    const model = entityModels.get(name);

    return model;
}

export const configureMongo = async (): Promise<void> => {
    const connectionPool = await createMongooseConnectionPool();

    entitySchemas.forEach((schema, name) => {
        const entityModel = setupModel(connectionPool, name, schema);

        entityModels.set(name, entityModel);
    });

    return;
}
