import mongoose, { Mongoose, Schema, Document } from 'mongoose';
import { UserProps } from '../domain';

const userSchema = new Schema<UserProps>({
    username: String,
    password: String
});

const createUserEntity = (mongoose: Mongoose) => {
    return mongoose.model('User', userSchema);
}

export const UserEntity = createUserEntity(mongoose);

export async function SetupMongoose(): Promise<void> {
    await mongoose.connect("mongodb://dev:dev@localhost:5010/");
}

