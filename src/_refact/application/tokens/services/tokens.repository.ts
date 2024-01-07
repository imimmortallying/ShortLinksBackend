
export interface UserToken {
    id: string,
    // refreshToken: string,
    username: string,
}

export interface ITokenProps {
    id: string,
    refreshToken: string,
    expireAt: {}
}

export interface ITokensRepository {
    // getByUserId(id:string): string;

    save(userToken: UserToken): Promise<any>;

}