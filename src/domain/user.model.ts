export interface IUserProps {
    username: string,
    password: string
}

export class User implements IUserProps {
    constructor(readonly id: string, private props: Required<IUserProps>) { }

    get username(): string {
        return this.props.username;
    }

    get password(): string {
        return this.props.password;
    }
}