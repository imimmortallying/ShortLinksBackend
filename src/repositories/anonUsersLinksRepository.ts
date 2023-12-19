
import { anonUsersLinksCollection } from "./db";

export const anonUsersLinksRepository = {

    async pushLink(fingerprint: string, link: string) {
        return await anonUsersLinksCollection.updateOne(
            { "fingerprint": fingerprint },
            { $addToSet: { "links": link } },
            { upsert: true }
        );
    },

}