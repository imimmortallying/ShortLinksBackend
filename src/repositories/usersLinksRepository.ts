
import { usersLinksCollection } from "./db";

export const usersLinksRepository = {

    async pushLink(userid: string, link: string) {
        return await usersLinksCollection.updateOne(
            { "id": userid },
            { $addToSet: { "links": link } },
            { upsert: true }
        );
    },

}