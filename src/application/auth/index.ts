import { sessionGenerator } from './services/session.generator';
import { userRepository } from '../users';
import { AuthService } from './services/auth.service';
import { bcryptPasswordHasher } from './services/password.hasher';
import { TokensGenerator } from '../../infra/tokens.generator/impl/tokens.generator';


const authService = new AuthService(userRepository, sessionGenerator, bcryptPasswordHasher, new TokensGenerator());

export {
    authService
};
