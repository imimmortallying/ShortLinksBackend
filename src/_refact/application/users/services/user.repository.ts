import { User } from "../../../domain";

export interface IUserRepository {
    insert(user: User): Promise<any>;

    exists(username: string): Promise<boolean>;

    getByUsername(username: string): Promise<User | null>;
}