

interface ILinkProps {
    owner: string,
    original: string,
    alias: string,
}

export interface ILinkRepository {

    create(link: ILinkProps, userStatus: 'anon' | 'signedin', TTL: number | 'permanent' ): Promise<string | null>;

    findNewestLink(userid: string): Promise<string | null>;

    findOriginalLinkAndUpdate(cmd:{alias: string, visitor: string}): Promise<string | null>;

    aliasExists(alias: string): Promise<boolean>;

    updateExistingLinkCreationAtAndReturn(link: string): Promise<string | null>;

    findAllLinks(user: string): Promise< {alias:string}[] | null>;

    createNextId(): string;


}