
interface User {
    username: string,
    password: string
}

export interface ISessionProps {
    id: string,
    refreshToken: string,
    expireAt: Date
}

export interface ISessionRepository {

    createSession(id:string, refreshToken:string): Promise<void>;
    deleteSession(refreshToken:string): Promise<boolean>;
    findSession(refreshToken: string): Promise<boolean>

}