

interface ILinkProps {
    owner: string,
    original: string,
    alias: string,
}

export interface ILinkRepository {

    create(link: ILinkProps, userStatus: 'anon' | 'signedin' ): Promise<boolean>;

    findNewestLink(userid: string): Promise<string | null>;

    findOriginalLinkAndUpdate(cmd:{alias: string, visitor: string}): Promise<string | null>;

    aliasExists(alias: string): Promise<boolean>;

    updateExistingLinkCreationAt(link: string): Promise<boolean>;

    findAllLinks(user: string): Promise< {alias:string}[] | null>;

    createNextId(): string;


}