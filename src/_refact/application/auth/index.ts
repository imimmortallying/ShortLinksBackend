import { sessionGenerator } from './services/session.generator';
import { userRepository } from '../users';
import { AuthService } from './services/auth.service';
import { bcryptPasswordHasher } from './services/password.hasher';


const authService = new AuthService(userRepository, sessionGenerator, bcryptPasswordHasher);

export {
    authService
};
