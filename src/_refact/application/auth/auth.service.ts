import logger from "../../core/core.logger.pino";
import { Either, failureE, success } from "../../core/core.result";
import { User } from "../../domain";
import { IUserRepository } from "../users";
import { IPasswordHasher } from "../utils/password.hasher";

export enum AuthServiceError {
    UsernameIsTaken = "Username already taken",
    UserDoesNotExist = "User does not exist",
    CredentialFailure = "Username or password is invalid",
}

export class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async signIn(dto: { username: string, password: string }): Promise<Either<AuthServiceError>> {
        if (await this.userRepository.exists(dto.username)) {
            return failureE(AuthServiceError.UsernameIsTaken);
        }

        const user = new User({
            username: dto.username,
            password: await this.passwordHasher.hash(dto.password)
        });

        await this.userRepository.insert(user);

        logger.info("A new user has been signed in");

        return success();
    }

    async logIn(dto: { username: string, password: string }): Promise<Either<AuthServiceError>> {
        const user = await this.userRepository.getByUsername(dto.username);

        if (user === null) {
            return failureE(AuthServiceError.UserDoesNotExist);
        }

        if (await this.passwordHasher.verify(dto.password, user.password) == false) {
            return failureE(AuthServiceError.CredentialFailure);
        }

        return success();
    }
}