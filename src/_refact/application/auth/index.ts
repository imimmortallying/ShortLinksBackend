import { tokensRepository } from '../tokens';
import { userRepository } from '../users';
import { AuthService } from './services/auth.service';
import { BcryptPasswordHasher } from './services/impl/password.bcrypt.hasher';

const authService = new AuthService(userRepository, tokensRepository, new BcryptPasswordHasher());

export {
    authService
};
