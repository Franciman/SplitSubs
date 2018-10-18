import * as React from 'react'

import { User, UsersManager } from './users-manager'

export interface TranslatorRowProps {
    rowIndex: number,
    usersManager: UsersManager,
    user: User,
}

export class TranslatorRow extends React.Component<TranslatorRowProps, {}> {
    constructor(props: TranslatorRowProps) {
        super(props)
    }

    onChange(e: React.FormEvent<HTMLInputElement>) {
        this.props.usersManager.updateUser(this.props.rowIndex, e.currentTarget.value);
    }

    removeUser() {
        if(!this.props.usersManager.removeUser(this.props.rowIndex)) {
            alert("You can't remove all translators");
        }
    }

    render() {
        let part = this.props.user.partSize;
        let partSize;
        if(this.props.user.partSize == 0) {
            partSize = `${part} lines (Translator not needed)`
        }
        else if(this.props.user.partSize == 1) {
            partSize = `${part} line`
        }
        else {
            partSize = `${part} lines`
        }
        return (
            <tr>
                <td>
                    <input type="text"
                           value={this.props.user.name}
                           onChange={(e) => this.onChange(e)} required />
                </td>
                <td>
                    <button type="button" className="deleteButton" onClick={() => this.removeUser()}>
                        Delete
                    </button>
                </td>
                <td>
                    {partSize}
                </td>
            </tr>
        );
    }
}

