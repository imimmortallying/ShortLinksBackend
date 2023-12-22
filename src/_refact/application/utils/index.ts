import { BcryptPasswordHasher } from "./impl/password.bcrypt.hasher";
import { IPasswordHasher } from "./password.hasher";

const passwordHasher: IPasswordHasher = new BcryptPasswordHasher();

export {
    passwordHasher,
}