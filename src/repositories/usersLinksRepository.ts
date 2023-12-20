
import { usersLinksCollection } from "./db";

export const usersLinksRepository = {

    async pushLink(owner: string, link: string) {
        // owner - либо ID залогиненого пользователя, либо finger анонимного

        // переделать структуру запроса, но не удаляй.
        // Потому что похожый запрос будет при добавлении ip источника перехода в массиве, внутри объекта ссылки
        return await usersLinksCollection.insertOne({
            "owner": owner,
            "original": link,
            "alias": "short",
            "count": 0
        })
    },

    async findOriginalLink(alias: string) {
        const foundOriginalLink = await usersLinksCollection.findOne({alias:alias});
        return foundOriginalLink?.original
    },

    async hasLinkAlready (link:string) {
        const hasLink = await usersLinksCollection.findOne({original: link})
        return hasLink ? true : false;
    },

    async hasAliasAlready (alias:string) {
        const hasAlias = await usersLinksCollection.findOne({original: alias})
        return hasAlias ? true : false;
    },

}