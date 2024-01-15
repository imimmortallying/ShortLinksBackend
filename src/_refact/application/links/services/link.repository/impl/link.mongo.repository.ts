import mongoose from 'mongoose';

import { ILinkRepository } from '../model/ILink.repository';
import { getModel } from '../../../../../configuration/configuration.mongo';


interface ILinkProps {
    owner: string,
    original: string,
    alias: string,
    id: string,
}

interface IAllLinksProps {

    alias: string,

}

export default class MongooseLinkRepository implements ILinkRepository {

    createNextId(): string {
        return new mongoose.Types.ObjectId().toString();
    }

    async create(link: ILinkProps, userStatus: 'anon' | 'signedin'): Promise<boolean> {

        // получаю статус из props, выставляю соотв. TTL
        let TTL;
        userStatus === 'anon'
            ? TTL = Date.now() + 1000 * 60 * 60 * 24 * 5 // 5 дней для status = anon
            : TTL = Date.now() + 1000 * 60 * 60 * 24 * 30 // 30 дней для status = signedin

        const newLink = await getModel<ILinkProps>('link').create({
            id: mongoose.Types.ObjectId.createFromHexString(link.id),
            owner: link.owner,
            original: link.original,
            alias: link.alias,
            expireAt: TTL,
            createdAt: Date.now(),

        });
        return newLink === null ? false : true
    }

    async findOriginalLink(alias: string): Promise<string | null> {
        const foundLink = await getModel<ILinkProps>('link')
        .findOne({alias:alias}, {original: 1, _id: 0})
        console.log('foundLink:', foundLink)
        return foundLink === null ? null : foundLink.original;

    }

    async findNewestLink(userid: string): Promise<any> {
        const foundLink = await getModel<ILinkProps>('link')
        .find({owner:userid})
        .sort({createdAt:-1})
        .select({ alias: 1, _id: 0 })
        .limit(1)

        
        if (foundLink.length > 0) {
            return foundLink[0].alias;
          } else {
            return null;
          }
    }

    async aliasExists(alias: string): Promise<boolean> {
        const foundAlias = await getModel<ILinkProps>('link').exists({ alias: alias });

        return foundAlias !== null;
    }

    async updateExistingLinkCreationAt(link: string): Promise<boolean> {
        const original = await getModel<ILinkProps>('link').findOneAndUpdate({ original: link }, {createdAt: Date.now()});
        return original === null ? false : true
        // return original.alias;
    }


    async findAllLinks(user: string): Promise<Array<{ alias: string }> | null> {
        const allLinks = await getModel<IAllLinksProps>('link').find({ owner: user }).select({ alias: 1, _id: 0 });

        return allLinks
    }

}
