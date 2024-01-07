import logger from '../../../core/core.logger.pino';
// import { Either, EitherUser, EitherMessage, failureE, success } from '../../../core/core.result';
import { EitherMessage, successWithMessage, errorWithMessage, EitherR} from '../../../core/core.result';
import { User } from '../../../domain';
import { IUserProps } from '../../../domain/user.model';
import { ITokensRepository } from '../../tokens/services/tokens.repository';
import { IUserRepository } from '../../users';
import { IPasswordHasher } from './password.hasher';

import * as E from 'fp-ts/Either'

export enum AuthServiceError {
    UsernameIsTaken = 'Username already taken',
    UserDoesNotExist = 'User does not exist',
    CredentialFailure = 'Username or password is invalid',
}

export enum AuthServiceSuccessMessage {
    UserHasBeenSignedUp = 'User has been signed up'
}

export class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private tokensRepository: ITokensRepository,
        private passwordHasher: IPasswordHasher
    ) { } // вспомни, почитай че это за скобки
    // прочитай про абстрактные классы. Хотя, и без них классы типизруются через I



    async registerUser(cmd: { username: string, password: string }): Promise<EitherMessage> {
        if (await this.userRepository.exists(cmd.username)) {
            // return E.left({errorMessage: AuthServiceError.UsernameIsTaken});
            return errorWithMessage(AuthServiceError.UsernameIsTaken);
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

        // return E.right({successMessage: AuthServiceSuccessMessage.UserHasBeenSignedIn});
        return successWithMessage(AuthServiceSuccessMessage.UserHasBeenSignedUp);
    }
    // async registerUser(cmd: { username: string, password: string }): Promise<Either<AuthServiceError>> {
    //     if (await this.userRepository.exists(cmd.username)) {
    //         return failureE(AuthServiceError.UsernameIsTaken);
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

    //     return success();
    // }

    // async createSession(cmd: { username: string, password: string }): Promise<EitherUser<string>> {
    // async createSession(cmd: { username: string, password: string }): Promise<EitherUser<string>> {
    async createSession(cmd: { username: string, password: string }): Promise<EitherR<{accessToken:string, refreshToken:string}>> {
        const user = await this.userRepository.getByUsername(cmd.username);
        console.log(user)
        if (user === null) {
            return  E.left(AuthServiceError.UserDoesNotExist);
        }

        if (await this.passwordHasher.verify(cmd.password, user.password) == false) {
            return E.left(AuthServiceError.CredentialFailure);
        }

        const newTokens = await this.tokensRepository.save({id:user.id, username:user.username})

        return E.right(newTokens);
        // return E.right(AuthServiceSuccessMessage.UserHasBeenSignedIn);
    }
    // async createSession(cmd: { username: string, password: string }): Promise<Either<AuthServiceError>> {
    //     const user = await this.userRepository.getByUsername(cmd.username);

    //     if (user === null) {
    //         return failureE(AuthServiceError.UserDoesNotExist);
    //     }

    //     if (await this.passwordHasher.verify(cmd.password, user.password) == false) {
    //         return failureE(AuthServiceError.CredentialFailure);
    //     }

    //     return success();
    // }
}