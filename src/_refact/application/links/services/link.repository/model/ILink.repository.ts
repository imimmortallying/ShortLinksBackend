

interface ILinkProps {
    owner: string,
    original: string,
    alias: string,
}

export interface ILinkRepository {

    create(link: ILinkProps): Promise<any>;

    aliasExists(link: ILinkProps): Promise<boolean>;

    originalExists(link: ILinkProps): Promise<boolean>;

    createNextId(): string;

}