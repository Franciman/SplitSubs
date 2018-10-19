import * as React from 'react'
import { User } from './users-manager'

export interface ReportTableProps {
    users: Array<User>,
}

export class ReportTable extends React.Component<ReportTableProps, {}> {
    constructor(props: ReportTableProps) {
        super(props);
    }

    render() {
        let entries = [];
        let startPart = 1;
        for(let i = 0; i < this.props.users.length; i++) {
            let part = 'Translator not needed';
            if(this.props.users[i].partSize > 0) {
                part = `${startPart}-${startPart + this.props.users[i].partSize - 1}`;
            }
            let entry = (
                <tr>
                    <td>{`@${this.props.users[i].name}`}</td>
                    <td>{part}</td>
                </tr>
            );
            entries.push(entry);
            startPart += this.props.users[i].partSize;
        }

        return (
            <table>
                <tbody>
                    <tr>
                        <th>Divisions report:</th>
                    </tr>
                    {entries}
                </tbody>
            </table>
        );
    }
}
