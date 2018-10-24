import * as React from 'react'
import { TranslatorRow } from './translator-row'
import { User, UsersManager } from './users-manager'

export interface UserListProps {
    usersManager: UsersManager,
    users: Array<User>,
}

export class UserList extends React.Component<UserListProps, {}> {
    private userAdded: boolean
    private lastTranslatorRowRef = React.createRef<TranslatorRow>();

    constructor(props: UserListProps) {
        super(props)
        this.userAdded = false;
    }

    addUser() {
        if(!this.props.usersManager.addUser())
        {
            alert("No more translators needed");
        }
        else {
            this.userAdded = true;
        }
    }

    componentDidMount() {
        this.focusLastTranslator();
    }

    componentDidUpdate() {
        if(this.userAdded) {
            let root = document.getElementById('root');
            root.scrollTop = root.scrollHeight - root.clientHeight;
            this.focusLastTranslator();
            this.userAdded = false;
        }
    }

    focusLastTranslator() {
        if(this.lastTranslatorRowRef.current != null) {
            this.lastTranslatorRowRef.current.focus();
        }
    }

    render() {
        let userElements = [];
        for(let i = 0; i < this.props.users.length; i++)
        {
            // TODO: Probably it's suboptimal to repeatedly assign lastTranslatorRowRef
            userElements.push(<TranslatorRow usersManager={this.props.usersManager}
                                             user={this.props.users[i]}
                                             rowIndex={i}
                                             ref={this.lastTranslatorRowRef}
                                             key={i} />);
        }

        return (
            <div>
                <table>
                    <tbody>
                       <tr>
                           <th>
                               Translators:
                           </th>
                       </tr>
                       {userElements}
                       <tr>
                           <td id="addButtonCell" colSpan={3}>
                               <button type="button" className="addButton" onClick={() => this.addUser()}>Add translator</button>
                           </td>
                       </tr>
                    </tbody>
                </table>
                <div>
                </div>
            </div>
        );
    }
}

