
import { usersLinksCollection } from "./db";

export const usersLinksRepository = {

    async pushLink(owner: string, link: string) {
        // owner - либо ID залогиненого пользователя, либо finger анонимного
        return await usersLinksCollection.updateOne(
            { "owner": owner },
            { $addToSet: { "links": link } },
            { upsert: true }
        );
    },

}