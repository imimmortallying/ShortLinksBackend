
import { usersCollection } from "./db";

interface User {
    id: string, // как правильно описать?
    username: string,
    password: string,
}

export const authRepository = {
    // не забыл ли я тут await?
    async checkIsUserRegistred(username:string) {
        return await usersCollection.find({username:username}).toArray();
    },

    async findUserByUsername(username:string) {
        return await usersCollection.find({username:username}).toArray();
    },

    async findUserById(id:string) {
        return await usersCollection.find({id:id}).toArray();
    },

    async createNewUser(newUser:User) {
        await usersCollection.insertOne(newUser);
        return newUser;
    }

}