export interface ITokensGenerator {
    // нужен ли промис для создания токенов? вроде работает
    generate(id: string, username: string): {accessToken:string, refreshToken:string};

    // verify(password: string, hashedPassword: string): Promise<boolean>;
}
