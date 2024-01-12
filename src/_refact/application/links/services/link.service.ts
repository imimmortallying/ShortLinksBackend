import logger from '../../../core/core.logger.pino';

import { EitherR, EitherString } from '../../../core/core.result';
import { IAliasGenerator } from './alias.generator/model/IAliasGenerator';




import * as E from 'fp-ts/Either'
import { ILinkRepository } from './link.repository/model/ILink.repository';
import { Link } from '../../../domain/link.model';
import { ITokensGenerator } from '../../../infra/tokens.generator/model/ITokens.generator';

export enum QueryMessage {
    UserHaveNoLinks = 'User have no links',
}

export class LinkService {
    constructor(
        private aliasGenerator: IAliasGenerator,
        // private tokensGenerator: ITokensGenerator,
        private linkResopitory: ILinkRepository
    ) { } // вспомни, почитай че это за скобки
    // прочитай про абстрактные классы. Хотя, и без них классы типизруются через I


    async saveLink(cmd: { link: string, user: string, status: 'signedin' | 'anon' }): Promise<EitherString> {

        const hasLinkAlready = await this.linkResopitory.originalExists(cmd.link);
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
            let hasAlias = await linkResopitory.aliasExists(result);
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

        const newAlias = await this.linkResopitory.create(link, cmd.status);
        logger.info('A new link has been saved');
        return E.right(newAlias);

    }

    async findAllLinks(cmd: { user: string, status: 'signedin' | 'anon' }): Promise<EitherR<{ alias: string }[]>> {
        const allFoundLinks = await this.linkResopitory.findAllLinks(cmd.user);
        console.log('all:', allFoundLinks)

        return E.right(allFoundLinks);
        // какая может быть ошибка?

    }
}