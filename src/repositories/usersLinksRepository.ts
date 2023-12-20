
import { usersLinksCollection } from "./db";

export const usersLinksRepository = {

    async pushAuthLink(userid: string, link: string) {
        return await usersLinksCollection.updateOne(
            { "id": userid },
            { $addToSet: { "links": link } },
            { upsert: true }
        );
    },

    async pushAnonLink(fingerprint: string, link: string) {
        return await usersLinksCollection.updateOne(
            { "fingerprint": fingerprint },
            { $addToSet: { "links": link } },
            { upsert: true }
        );
    },

}