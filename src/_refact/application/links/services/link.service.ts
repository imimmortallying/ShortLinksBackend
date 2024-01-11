import logger from '../../../core/core.logger.pino';

import { EitherMessage, successWithMessage, errorWithMessage, EitherR } from '../../../core/core.result';
import { ISessionRepository } from '../../auth/services/session.generator';
import { IAliasGenerator } from './alias.generator/model/IAliasGenerator';




import * as E from 'fp-ts/Either'
import { ILinkRepository } from './link.repository/model/ILink.repository';

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



    // async registerUser(cmd: { username: string, password: string }): Promise<EitherMessage> {
    //     if (await this.userRepository.exists(cmd.username)) {

    //         return errorWithMessage(AuthServiceError.UsernameIsTaken);
    //     }

    //     const user = new User(
    //         this.userRepository.createNextId(),
    //         {
    //             username: cmd.username,
    //             password: await this.passwordHasher.hash(cmd.password)
    //         }
    //     );

    //     await this.userRepository.create(user);

    //     logger.info('A new user has been signed in');

    //     return successWithMessage(AuthServiceSuccessMessage.UserHasBeenSignedUp);
    // }

}