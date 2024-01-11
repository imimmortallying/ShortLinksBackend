import mongoose from 'mongoose';

import { ILinkRepository } from '../model/ILink.repository';
import { getModel } from '../../../../../configuration/configuration.mongo';


interface ILinkProps {
    owner: string,
    original: string,
    alias: string,
}

export default class MongooseLinkRepository implements ILinkRepository  {

    createNextId(): string {
        return new mongoose.Types.ObjectId().toString();
    }

    async create(link: ILinkProps): Promise<any> {
        await getModel<ILinkProps>('link').create({
            // id: mongoose.Types.ObjectId.createFromHexString(link.id),
            owner: link.owner,
            original: link.original,
            alias: link.alias,
        });

        return;
    }

    async aliasExists(link: ILinkProps): Promise<boolean> {
        const alias = await getModel<ILinkProps>('link').exists({ alias: link.alias});

        return alias !== null;
    }

    async originalExists(link: ILinkProps): Promise<boolean>{
        const original = await getModel<ILinkProps>('link').exists({ original: link.original});

        return original !== null;
    }

}
