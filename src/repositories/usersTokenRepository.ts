
import { usersTokenCollection } from "./db";

interface UsersToken {
    id: string,
    refreshToken: string,
}

export const usersTokenRepository = {

    async findTokenByUserid(userid:string) {
        return await usersTokenCollection.findOne({id:userid});
    },

    async findTokenByItself(refreshToken:string) {
        return await usersTokenCollection.findOne({refreshToken:refreshToken});
    },

    async createUsersToken(newUsersToken:UsersToken) {
        await usersTokenCollection.insertOne(newUsersToken);
        return newUsersToken;
    },

    async refreshUsersToken(newUsersToken:UsersToken) {
        const result = await usersTokenCollection.updateOne({id:newUsersToken.id}, {$set:{refreshToken:newUsersToken.refreshToken}});
        return result.matchedCount === 1;
    },

    // ulbi удаляет запись через поиск токена. Почему не поиск по ид юзера? есть ли разница. Удалю через id для унификации //! не смогу
    // в cookie будет храниться решреф токен сам по себе, поэтому и удаляю через поиск по нему?
    async removeUsersToken(refreshToken:string) {
        const result = await usersTokenCollection.deleteOne({refreshToken:refreshToken});
        return result.deletedCount === 1;
    }
}