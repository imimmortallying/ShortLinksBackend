import { userRepository } from '../users';
import { AuthService } from './services/auth.service';
import { BcryptPasswordHasher } from './services/impl/password.bcrypt.hasher';

const authService = new AuthService(userRepository, new BcryptPasswordHasher());

export {
    authService
};
