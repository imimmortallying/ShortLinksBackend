
// export interface UserToken {
//     id: string,
//     // refreshToken: string,
//     username: string,
// }

import { User } from "../../../../../domain";

export interface ISessionProps {
    id: string,
    refreshToken: string,
    expireAt: {}
}

export interface ISessionRepository {
    // getByUserId(id:string): string;

    createSession(user: User): Promise<{ accessToken:string, refreshToken:string }>;

}