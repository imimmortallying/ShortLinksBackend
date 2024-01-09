
interface User {
    username: string,
    password: string
}

export interface ISessionProps {
    id: string,
    refreshToken: string,
    expireAt: {}
}

export interface ISessionRepository {

    createSession(user: User): Promise<{ accessToken:string, refreshToken:string }>;
    deleteSession(refreshToken:string): Promise<boolean>;

}