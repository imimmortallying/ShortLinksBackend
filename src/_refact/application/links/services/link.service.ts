import logger from '../../../core/core.logger.pino';

import { EitherMessage, successWithMessage, errorWithMessage, EitherR } from '../../../core/core.result';
import { ISessionRepository } from '../../auth/services/session.generator';
import { IAliasGenerator } from './alias.generator/model/IAliasGenerator';




import * as E from 'fp-ts/Either'
import { ILinkRepository } from './link.repository/model/ILink.repository';
import { Link } from '../../../domain/link.model';

export enum AuthServiceError {
    UsernameIsTaken = 'Username already taken',
    UserDoesNotExist = 'User does not exist',
    CredentialFailure = 'Username or password is invalid',
    CookieIsEmpty = 'Cookie is empty'
}

export enum AuthServiceSuccessMessage {
    UserHasBeenSignedUp = 'User has been signed up',
    UserHasBeenSignedOut = 'User has been signed out',
}

export class LinkService {
    constructor(
        private aliasGenerator: IAliasGenerator,
        private sessionGenerator: ISessionRepository,
        private linkResopitory: ILinkRepository
    ) { } // вспомни, почитай че это за скобки
    // прочитай про абстрактные классы. Хотя, и без них классы типизруются через I



    async saveLink(cmd: { link: string, user: string }): Promise<any> {


        const link = new Link(
            this.linkResopitory.createNextId(),
            {
                alias: this.aliasGenerator.generate(5), // добавить await, чтобы alias generator не только создавал, но и проверял наличие alias в бд
                original: cmd.link,
                owner: cmd.user
            }
        );

        await this.linkResopitory.create(link);

        return

        //     await this.userRepository.create(user);

        //     logger.info('A new user has been signed in');

        //     return successWithMessage(AuthServiceSuccessMessage.UserHasBeenSignedUp);
        // }

    }
}