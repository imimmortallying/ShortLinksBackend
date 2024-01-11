import logger from '../../../core/core.logger.pino';

import { EitherMessage, successWithMessage, errorWithMessage, EitherR } from '../../../core/core.result';
import { ISessionRepository } from '../../auth/services/session.generator';
import { IAliasGenerator } from './alias.generator/model/IAliasGenerator';




import * as E from 'fp-ts/Either'
import { ILinkRepository } from './link.repository/model/ILink.repository';
import { Link } from '../../../domain/link.model';
import { ITokensGenerator } from '../../../infra/tokens.generator/model/ITokens.generator';

export enum SessionValidationError {
    EmptyAccessToken = 'empty access token',
}

export enum AuthServiceSuccessMessage {
    UserHasBeenSignedUp = 'User has been signed up',
    UserHasBeenSignedOut = 'User has been signed out',
}

export class LinkService {
    constructor(
        private aliasGenerator: IAliasGenerator,
        // private tokensGenerator: ITokensGenerator,
        private linkResopitory: ILinkRepository
    ) { } // вспомни, почитай че это за скобки
    // прочитай про абстрактные классы. Хотя, и без них классы типизруются через I


    async saveLink(cmd: { link: string, user: string, status: 'signedin' | 'anon'}): Promise<EitherMessage> {

        // получился мутант с минимальной читаемостью, явно нарушающий все solid и тп принципы
        // я опять запутался что где лучше вызывать и где хранить
        // если бы я просто инкапсулировал модуль и обращался к нему по необходимости, мне не пришлось бы делать
        // такие конструкции. Когда нужна эта инкапсуляция класса в классе?
        async function checkAlias(length:number, aliasGenerator:IAliasGenerator, linkResopitory:ILinkRepository) {
            let result = aliasGenerator.generate(length)
            let hasAlias = await linkResopitory.aliasExists(result);
            if (hasAlias){
                result = this.aliasGenerator.generate(length);
            }
            return result;
        }

        const link = new Link(
            this.linkResopitory.createNextId(),
            {
                alias: await checkAlias(5, this.aliasGenerator, this.linkResopitory), 
                original: cmd.link,
                owner: cmd.user
            }
        );



        // const aliasExists = this.linkResopitory.aliasExists(link);

        await this.linkResopitory.create(link);

        return

        //     await this.userRepository.create(user);

        //     logger.info('A new user has been signed in');

        //     return successWithMessage(AuthServiceSuccessMessage.UserHasBeenSignedUp);
        // }

    }
}