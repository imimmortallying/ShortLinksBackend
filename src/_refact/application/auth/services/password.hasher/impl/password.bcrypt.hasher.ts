import bcrypt from "bcryptjs";
import { IPasswordHasher } from "../models/IPassword.hasher";

export class BcryptPasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    }

    verify(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
