import logger from '../../../core/core.logger.pino';

import { EitherR, EitherString } from '../../../core/core.result';
import { IAliasGenerator } from './alias.generator/model/IAliasGenerator';




import * as E from 'fp-ts/Either'
import { ILinkRepository } from './link.repository/model/ILink.repository';
import { Link } from '../../../domain/link.model';

export enum QueryMessage {
    UserHaveNoLinks = 'User have no links',
    NewLinkHasBeenCreated = 'New link has been created',
}

export enum QueryErrorMessage {
    LinkDoesntExist = 'Link doesnt exist',
    CouldntCreateLink = 'Couldnt create link',
}

export class LinkService {
    constructor(
        private aliasGenerator: IAliasGenerator,
        // private tokensGenerator: ITokensGenerator,
        private linkResopitory: ILinkRepository
    ) { } // вспомни, почитай че это за скобки
    // прочитай про абстрактные классы. Хотя, и без них классы типизруются через I


    async saveLink(cmd: { link: string, user: string, status: 'signedin' | 'anon', TTL: number|'permanent' }): Promise<EitherString> {

        const hasLinkAlready = await this.linkResopitory.updateExistingLinkCreationAtAndReturn(cmd.link);
        if (hasLinkAlready) {
            logger.info('An existing link has been returned');
            return E.right(hasLinkAlready)
        }

        // получился мутант с минимальной читаемостью, явно нарушающий все solid и тп принципы
        // я опять запутался что где лучше вызывать и где хранить
        // если бы я просто инкапсулировал модуль и обращался к нему по необходимости, мне не пришлось бы делать
        // такие конструкции. Когда нужна эта инкапсуляция класса в классе?
        async function checkAlias(length: number, aliasGenerator: IAliasGenerator, linkResopitory: ILinkRepository) {
            let result = aliasGenerator.generate(length)
            const hasAlias = await linkResopitory.aliasExists(result);
            if (hasAlias) {
                result = this.aliasGenerator.generate(length);
            }
            return result;
        }

        const link = new Link(
            this.linkResopitory.createNextId(),
            {
                alias: await checkAlias(5, this.aliasGenerator, this.linkResopitory),
                original: cmd.link,
                owner: cmd.user,

            }
        );

        const newAlias = await this.linkResopitory.create(link, cmd.status, cmd.TTL);
        return newAlias ? E.right(newAlias) : E.left(QueryErrorMessage.CouldntCreateLink)

    }


    async findAllLinks(cmd: { user: string, status: 'signedin' | 'anon' }): Promise<EitherR<string[]>> {
        const allFoundLinks = await this.linkResopitory.findAllLinks(cmd.user);

        const flattenLinks = allFoundLinks.map(el=>el.alias)
        return E.right(flattenLinks);
        // какая может быть ошибка?

    }

    async findNewestLink(cmd:{user: string} ): Promise<EitherString> {
        const foundNwewstLink = await this.linkResopitory.findNewestLink(cmd.user);

        return E.right(foundNwewstLink);
        // какая может быть ошибка?

    }

    async redirect(cmd:{alias: string, visitor: string} ): Promise<EitherString> {
        const foundOriginalLink = await this.linkResopitory.findOriginalLinkAndUpdate(cmd);
        


        return foundOriginalLink === null 
        ? E.left(QueryErrorMessage.LinkDoesntExist)
        : E.right(foundOriginalLink)
        // какая может быть ошибка?

    }
}