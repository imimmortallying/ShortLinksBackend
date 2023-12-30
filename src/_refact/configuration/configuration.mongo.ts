import mongoose, { Model, Mongoose, Schema } from 'mongoose';
import { IUserProps } from '../domain/user.model';

const entitySchemas = new Map<string, Schema>();

entitySchemas.set('user', new Schema<IUserProps>({
    username: String,
    password: String
}));

const entityModels = new Map<string, Model<any>>;

const setupModel = <TSchema extends Schema = any>(
    connection: Mongoose, name: string, schema: TSchema
) => {
    return connection.model(name, schema);
};

export const createMongooseConnectionPool = (): Promise<Mongoose> => {
    return mongoose.connect('mongodb://dev:dev@localhost:5010/');
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
