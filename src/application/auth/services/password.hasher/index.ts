import { BcryptPasswordHasher } from "./impl/password.bcrypt.hasher";


const bcryptPasswordHasher = new BcryptPasswordHasher()

export {
    bcryptPasswordHasher
};