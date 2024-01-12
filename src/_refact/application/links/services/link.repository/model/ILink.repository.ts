

interface ILinkProps {
    owner: string,
    original: string,
    alias: string,
}

export interface ILinkRepository {

    create(link: ILinkProps, userStatus: 'anon' | 'signedin' ): Promise<any>;

    aliasExists(alias: string): Promise<boolean>;

    originalExists(link: string): Promise<string|null>;

    findAllLinks(user: string): Promise< Array<{alias:string}> | null>;

    createNextId(): string;

}