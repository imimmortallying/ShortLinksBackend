import mongoose from 'mongoose';

import { ILinkRepository } from '../model/ILink.repository';
import { getModel } from '../../../../../configuration/configuration.mongo';

interface ILinkProps {
  owner: string;
  original: string;
  alias: string;
  id: string;
}

interface IAllLinksProps {
  alias: string;
  clicksCount: number;
}

export default class MongooseLinkRepository implements ILinkRepository {
  createNextId(): string {
    return new mongoose.Types.ObjectId().toString();
  }

  async create(
    link: ILinkProps,
    userStatus: 'anon' | 'signedin',
    TTL: number | 'permanent'
  ): Promise<string | null> {
    // получаю статус из props, выставляю соотв. TTL
    let newTTL;
    if (TTL === 'permanent') {
      newTTL = null;
    } else {
      userStatus === 'anon'
        ? (newTTL = Date.now() + 1000 * 60 * 60 * 24 * 5) // 5 дней для status = anon
        : (newTTL = Date.now() + 1000 * 60 * 60 * 24 * TTL); // TTL дней для status = signedin
    }

    const newLink = await getModel<ILinkProps>('link').create({
      id: mongoose.Types.ObjectId.createFromHexString(link.id),
      owner: link.owner,
      original: link.original,
      alias: link.alias,
      expireAt: newTTL,
      createdAt: Date.now(),
      clicksCount: 0,
    });
    return newLink === null ? null : newLink.alias;
  }

  async findOriginalLinkAndUpdate(cmd: {
    alias: string;
    visitor: string;
  }): Promise<string | null> {
    const foundLink = await getModel<ILinkProps>('link')
      .findOneAndUpdate(
        { alias: cmd.alias },
        { $inc: { clicksCount: 1 }, $push: { visitors: cmd.visitor } }
      )
      .select({ original: 1, count: 1, _id: 0 });

    return foundLink === null ? null : foundLink.original;
  }

  async findNewestLink(userid: string): Promise<any> {
    const foundLink = await getModel<ILinkProps>('link')
      .find({ owner: userid })
      .sort({ createdAt: -1 })
      .select({ alias: 1, _id: 0 })
      .limit(1);

    if (foundLink.length > 0) {
      return foundLink[0].alias;
    } else {
      return null;
    }
  }

  async aliasExists(alias: string): Promise<boolean> {
    const foundAlias = await getModel<ILinkProps>('link').exists({
      alias: alias,
    });

    return foundAlias !== null;
  }

  async updateExistingLinkCreationAtAndReturn(
    link: string
  ): Promise<string | null> {
    const original = await getModel<ILinkProps>('link').findOneAndUpdate(
      { original: link },
      { createdAt: Date.now() }
    );
    return original === null ? null : original.alias;
    // return original.alias;
  }

  async findAllLinks(
    user: string
//   ): Promise<[] | null> {
  ): Promise<{ alias: string, clicksCount: number }[] | null> {
    const allLinks = await getModel<IAllLinksProps>('link')
      .find({ owner: user })
      .select({ alias: 1, clicksCount: 1, _id: 0 });
    return allLinks;
  }
}
