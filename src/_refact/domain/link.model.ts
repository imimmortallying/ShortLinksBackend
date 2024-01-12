export interface ILinkProps {
    owner: string,
    original: string,
    alias: string,
    
}

export class Link implements ILinkProps {
    constructor(readonly id: string, private props: Required<ILinkProps>) { }

    get alias(): string {
        return this.props.alias;
    }

    get owner(): string {
        return this.props.owner;
    }

    get original(): string {
        return this.props.original;
    }

}