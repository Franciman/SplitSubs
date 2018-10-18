import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { User, UsersManager } from './users-manager'
import { UserList } from './user-list'
import * as Subtitle from 'subtitle'
import { ReportTable } from './report-table'
import { saveAs } from 'file-saver'
import * as JSZip from 'jszip'
import { extractSeriesNameAndEpisode } from './extract-series-name'

function splitSubsInZipArchive(subs: Array<any>, users: Array<User>): Promise<Blob> {
    let startPart = 0;
    let zip: JSZip = new JSZip();
    for(let i = 0; i < users.length; i++) {
        let part = subs.slice(startPart, startPart + users[i].partSize);
        let partText = Subtitle.stringify(part);
        zip.file(`sub.${users[i].name}.${startPart + 1}-${startPart + users[i].partSize}.srt`, partText);
        startPart += users[i].partSize;
    }
    return zip.generateAsync({type: "blob"});
}

enum LoadState {
    NotLoaded,
    Loading,
    Loaded
}

export interface SplitFormState {
    loadState: LoadState,
    users: Array<User>,
    subs: Array<any>,
    showReport: boolean,
}

export class SplitForm extends React.Component<{}, SplitFormState> {
    state: SplitFormState
    usersManager: UsersManager | null

    constructor(props: any) {
        super(props);
        this.state = {
            loadState: LoadState.NotLoaded,
            users: [],
            subs: [],
            showReport: false,
        };
    }

    initUsersManager(subsCount: number) {
        console.log(subsCount);
        this.usersManager = new UsersManager(this.state.users, subsCount, (newUsers: Array<User>) => {
            this.setState({ users: newUsers });
        });
        this.usersManager.addUser();
    }

    uninitUsersManager() {
        this.usersManager = null;
    }

    selectFile(e: React.FormEvent<HTMLInputElement>) {
        if(e.currentTarget.files.length != 0) {
            // Do parsing
            console.log(extractSeriesNameAndEpisode(e.currentTarget.files[0].name));
            this.setState({loadState: LoadState.Loading});
            let reader = new FileReader();
            reader.onload = (e) => {
                try {
                    let p = Subtitle.parse(reader.result);
                    if(p.length == 0) {
                        this.setState({subs: p, loadState: LoadState.NotLoaded});
                        this.uninitUsersManager();
                        alert("Empty srt file");
                    } else {
                        this.initUsersManager(p.length);
                        this.setState({subs: p, loadState: LoadState.Loaded});
                    }
                }
                catch(e) {
                    this.setState({subs: [], loadState: LoadState.NotLoaded});
                    this.uninitUsersManager();
                    alert("Invalid srt file");
                }
            };
            reader.readAsText(e.currentTarget.files[0]);
        }
        else {
            this.setState({subs: [], loadState: LoadState.NotLoaded});
        }
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        splitSubsInZipArchive(this.state.subs, this.state.users).then((blob) => {
            saveAs(blob, 'subtitles.zip');
        });
        this.setState({showReport: true});
    }

    render() {
        let userList: JSX.Element;
        let hud: JSX.Element;
        if(this.state.loadState == LoadState.Loaded) {

            userList = (
                <div className="topmostDiv">
                    <div>
                        <UserList users={this.state.users}
                                  usersManager={this.usersManager} />
                    </div>
                    <div>
                        <input type="submit" value="Split & Download!" />
                    </div>
                    <input type="hidden" name="translators" value={this.usersManager.jsonify()} />
                </div>
            );
        }
        else if(this.state.loadState == LoadState.Loading) {
            hud = <p>Loading...</p>
        }

        let report: JSX.Element;
        if(this.state.showReport) {
            report = (
                <div className="topmostDiv">
                    <ReportTable users={this.state.users} />
                </div>
            );
        }
        return (
            <form onSubmit={(e) => this.onSubmit(e)} >
                <div className="topmostDiv">
                    <label htmlFor="srtFile">Select subtitles file: </label>
                    <br />
                    <input type="file"
                           name="srtFile" accept=".srt"
                           id="srtFile"
                           onChange={(e) => this.selectFile(e)} />
                </div>
                {hud}
                {userList}
                {report}
            </form>
        );
    }
}

