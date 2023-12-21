
import { usersLinksCollection } from "./db";

export const usersLinksRepository = {

    async pushLink(owner: string, link: string, alias: string) {
        // owner - либо ID залогиненого пользователя, либо finger анонимного

        // переделать структуру запроса, но не удаляй.
        // Потому что похожый запрос будет при добавлении ip источника перехода в массиве, внутри объекта ссылки
        return await usersLinksCollection.insertOne({
            "owner": owner,
            "original": link,
            "alias": alias,
            "count": 0
        })

 
    },

    async findOriginalLink(alias: string) {
        const foundOriginalLink = await usersLinksCollection.findOne({alias:alias});
        return foundOriginalLink?.original
    },

    async hasLinkAlready (link:string) {
        const foundOriginalLink = await usersLinksCollection.findOne({original: link})
        return foundOriginalLink?.alias
    },

    async hasAliasAlready (alias:string) {
        const hasAlias = await usersLinksCollection.findOne({original: alias})
        return hasAlias ? true : false;
    },

    async findAllUsersLinks (userid:string) {
        const foundAllUsersLinks = await usersLinksCollection.find( {owner:userid}, {projection: {_id:0, owner:0, original:0, count:0}}).toArray()
        return foundAllUsersLinks;
    }

}