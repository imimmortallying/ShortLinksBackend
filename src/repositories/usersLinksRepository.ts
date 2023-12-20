
import { usersLinksCollection } from "./db";

export const usersLinksRepository = {

    async pushLink(owner: string, link: string) {
        // owner - либо ID залогиненого пользователя, либо finger анонимного

        // переделать структуру запроса, но не удаляй.
        // Потому что похожый запрос будет при добавлении ip источника перехода в массиве, внутри объекта ссылки
        return await usersLinksCollection.updateOne(
            { "owner": owner },
            { $addToSet: { "links": link } },
            { upsert: true }
        );
    },

    async findOriginalLink(alias: string) {
        const foundOriginalLink = await usersLinksCollection.findOne({alias:alias});
        return foundOriginalLink?.original
    }

}