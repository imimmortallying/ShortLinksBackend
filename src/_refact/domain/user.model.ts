export type UserProps = {
    username: string,
    password: string
}

export class User implements UserProps {
    private _id?: string;

    private props: UserProps;

    constructor(props: Required<UserProps>, id?: string) {
        this._id = id;
        this.props = props;
    }

    set id(id: string) {
        this._id = id;
    }

    get id(): string | undefined {
        return this._id;
    }

    get username(): string {
        return this.props.username;
    }

    get password(): string {
        return this.props.password;
    }
}