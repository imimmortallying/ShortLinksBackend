import { passwordHasher } from "../utils";
import { userRepository } from "../users";
import { AuthService } from "./auth.service";

const authService = new AuthService(userRepository, passwordHasher);

export {
    authService,
};
