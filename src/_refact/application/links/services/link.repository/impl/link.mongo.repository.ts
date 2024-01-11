import mongoose from 'mongoose';

import { ILinkRepository } from '../model/ILink.repository';
import { getModel } from '../../../../../configuration/configuration.mongo';


interface ILinkProps {
    owner: string,
    original: string,
    alias: string,
    id: string,
}

export default class MongooseLinkRepository implements ILinkRepository  {

    createNextId(): string {
        return new mongoose.Types.ObjectId().toString();
    }

    async create(link: ILinkProps): Promise<any> {
        await getModel<ILinkProps>('link').create({
            id: mongoose.Types.ObjectId.createFromHexString(link.id),
            owner: link.owner,
            original: link.original,
            alias: link.alias,
        });

        return;
    }

    async aliasExists(alias: string): Promise<boolean> {
        const foundAlias = await getModel<ILinkProps>('link').exists( {alias: alias} );

        return foundAlias !== null;
    }

    async originalExists(link: string): Promise<string|null>{
        const original = await getModel<ILinkProps>('link').findOne({ original: link} );
        return original === null ? null : original.alias 
        // return original.alias;
    }

}
