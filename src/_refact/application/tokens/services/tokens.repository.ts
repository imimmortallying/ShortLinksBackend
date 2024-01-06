
export interface UserToken {
    id: string,
    // refreshToken: string,
    username: string,
}

export interface ITokenProps {
    id: string,
    refreshToken: string,
}

export interface ITokensRepository {
    // getByUserId(id:string): string;

    save(userToken: UserToken): Promise<any>;

}