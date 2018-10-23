import * as React from 'react'
import { TranslatorRow } from './translator-row'
import { User, UsersManager } from './users-manager'

export interface UserListProps {
    usersManager: UsersManager,
    users: Array<User>,
}

export class UserList extends React.Component<UserListProps, {}> {
    keepAtBottom: boolean
    private lastTranslatorRowRef = React.createRef<TranslatorRow>();

    constructor(props: UserListProps) {
        super(props)
        this.keepAtBottom = false;
    }

    addUser() {
        if(!this.props.usersManager.addUser())
        {
            alert("No more translators needed");
        }
        else {
            this.keepAtBottom = true;
        }
    }

    componentDidMount() {
        this.focusLastTranslator();
    }

    componentDidUpdate() {
        if(this.keepAtBottom) {
            let root = document.getElementById('root');
            root.scrollTop = root.scrollHeight - root.clientHeight;
            this.keepAtBottom = false;
        }
        this.focusLastTranslator();
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

