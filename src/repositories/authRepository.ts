
import { usersCollection } from "./db";

interface User {
    id: string, // как правильно описать?
    username: string,
    password: string,
}

export const authRepository = {

    async checkIsUserRegistred(username:string) {
        return usersCollection.find({username:username}).toArray();
    },

    async createNewUser(newUser:User) {
        usersCollection.insertOne(newUser);
        return newUser;
    }

}