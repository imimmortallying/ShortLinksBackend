import logger from '../../../core/core.logger.pino';

import { EitherString, successWithMessage, errorWithMessage, EitherR } from '../../../core/core.result';
import { User } from '../../../domain';
import { IUserProps } from '../../../domain/user.model';
import { ISessionRepository } from './session.generator/models/ISession.repository';
import { IUserRepository } from '../../users';
import { IPasswordHasher } from './password.hasher/models/IPassword.hasher';

import * as E from 'fp-ts/Either'
import { ITokensGenerator } from '../../../infra/tokens.generator/model/ITokens.generator';

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

export enum AuthServiceErrorMessage {
    RefreshTokenValidationError = 'Refresh token validation error',
    NoResfreshTokenInDB = 'Refresh token not found in DB',
}

export class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private sessionRepository: ISessionRepository,
        private passwordHasher: IPasswordHasher,
        private tokensGenerator: ITokensGenerator,
    ) { } // вспомни, почитай че это за скобки
    // прочитай про абстрактные классы. Хотя, и без них классы типизруются через I



    async registerUser(cmd: { username: string, password: string }): Promise<EitherString> {
        if (await this.userRepository.exists(cmd.username)) {

            return E.left(AuthServiceError.UsernameIsTaken);
        }

        const user = new User(
            this.userRepository.createNextId(),
            {
                username: cmd.username,
                password: await this.passwordHasher.hash(cmd.password)
            }
        );

        await this.userRepository.create(user);

        logger.info('A new user has been signed in');

        return successWithMessage(AuthServiceSuccessMessage.UserHasBeenSignedUp);
    }

    async createSession(cmd: { username: string, password: string }): Promise<EitherR<{ accessToken: string, refreshToken: string }>> {
        const user = await this.userRepository.getByUsername(cmd.username);
        console.log(user)
        if (user === null) {
            return E.left(AuthServiceError.UserDoesNotExist);
        }

        if (await this.passwordHasher.verify(cmd.password, user.password) == false) {
            return E.left(AuthServiceError.CredentialFailure);
        }
        const { accessToken, refreshToken } = this.tokensGenerator.generate(user.id, user.username)
        const newSession = await this.sessionRepository.createSession(user.id, refreshToken)

        return E.right({accessToken, refreshToken});
    }

    async deleteSession(cmd:{refreshToken:string}): Promise<EitherString> {
        
        if (cmd.refreshToken === undefined) {
            return E.left(AuthServiceError.CookieIsEmpty)
        }
        const foundSession = await this.sessionRepository.deleteSession(cmd.refreshToken);

        return foundSession === true
            ? E.right(AuthServiceSuccessMessage.UserHasBeenSignedOut)
            : E.left(AuthServiceError.UserDoesNotExist) // какая должна быть ошибка и нужна ли она. Она возникает, если не нашлось совпадений для удаления

    }

    async refreshSession(oldRefreshToken:string): Promise<EitherR<{ accessToken: string, refreshToken: string, username: string }>> {

        

        const userData =  this.tokensGenerator.validateRefreshToken(oldRefreshToken) as {id:string, username: string};
        console.log('USERDATA:', userData)
        if (!userData ) return E.left(AuthServiceErrorMessage.RefreshTokenValidationError);
        
        const isExistingInDB = await this.sessionRepository.findSession(oldRefreshToken);
        console.log('isExistingInDB:', isExistingInDB)
        if (!isExistingInDB) return E.left(AuthServiceErrorMessage.NoResfreshTokenInDB);
        
        const { accessToken, refreshToken } = this.tokensGenerator.generate(userData.id, userData.username);

        const newSession = await this.sessionRepository.createSession(userData.id, refreshToken);

        return E.right({accessToken, refreshToken, username:userData.username})

    }

}