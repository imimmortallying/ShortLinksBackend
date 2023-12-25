import logger from '../../../core/core.logger.pino';
import { Either, failureE, success } from '../../../core/core.result';
import { User } from '../../../domain';
import { IUserRepository } from '../../users';
import { IPasswordHasher } from './password.hasher';

export enum AuthServiceError {
    UsernameIsTaken = 'Username already taken',
    UserDoesNotExist = 'User does not exist',
    CredentialFailure = 'Username or password is invalid',
}

export class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async registerUser(cmd: { username: string, password: string }): Promise<Either<AuthServiceError>> {
        if (await this.userRepository.exists(cmd.username)) {
            return failureE(AuthServiceError.UsernameIsTaken);
        }

        const user = new User({
            username: cmd.username,
            password: await this.passwordHasher.hash(cmd.password)
        });

        await this.userRepository.insert(user);

        logger.info('A new user has been signed in');

        return success();
    }

    async createSession(cmd: { username: string, password: string }): Promise<Either<AuthServiceError>> {
        const user = await this.userRepository.getByUsername(cmd.username);

        if (user === null) {
            return failureE(AuthServiceError.UserDoesNotExist);
        }

        if (await this.passwordHasher.verify(cmd.password, user.password) == false) {
            return failureE(AuthServiceError.CredentialFailure);
        }

        return success();
    }
}