export interface ITokensGenerator {
    // нужен ли промис для создания токенов? вроде работает
    generate(id: string, username: string): {accessToken:string, refreshToken:string};
    validateRefreshToken(token:string): {} | null;
    validateAccessToken(token:string): {} | null;

    // verify(password: string, hashedPassword: string): Promise<boolean>;
}
