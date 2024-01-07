import mongoose, { Model, Mongoose, Schema } from 'mongoose';
import { IUserProps } from '../domain/user.model';
import { ITokenProps, UserToken } from '../application/tokens/services/tokens.repository';

const entitySchemas = new Map<string, Schema>();

entitySchemas.set('user', new Schema<IUserProps>({
    username: String,
    password: String
}));

entitySchemas.set('token', new Schema<ITokenProps>({
    id: String,
    refreshToken: String,
    expireAt: {
        type: Date,
        default: Date.now() + 10 * 60 * 6000 * 24 * 30, // единственный вариант установки TTL, который сработал, остальные работают минуту
        // можно попробовать вынести в переменную. Тогда не забудь указать тут, при создании документа и при создании токена в генераторе одинаковые значения
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
