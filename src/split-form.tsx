import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { User, UsersManager } from './users-manager'
import { UserList } from './user-list'
import * as Subtitle from 'subtitle'
import { ReportTable } from './report-table'
import { saveAs } from 'file-saver'
import { splitSubsInZipArchive } from './zip-generator'
import { SeriesInfo, extractSeriesInfo } from './extract-series-info'

enum LoadState {
    NotLoaded,
    Loading,
    Loaded
}

export interface SplitFormState {
    loadState: LoadState,
    users: Array<User>,
    subs: Array<any>,
    seriesInfo: SeriesInfo,
    showReport: boolean,
}

function makeFilename(infos: SeriesInfo): string {
    let name = infos.seriesName;

    // This should not happen, but to be sure double check it
    if(name == '') {
        name = 'subtitles';
    }

    let episode = '';
    if(infos.season && infos.episode) {
        episode=`.s${infos.season}e${infos.episode}`;
    }
    return `${name}${episode}`;
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
            seriesInfo: { seriesName: "" },
            showReport: false,
        };
    }

    initUsersManager(subsCount: number) {
        console.log(subsCount);
        this.usersManager = new UsersManager(this.state.users, subsCount, (newUsers: Array<User>) => {
            this.setState({ users: newUsers });
        });
        if(this.usersManager.users.length == 0) {
            this.usersManager.addUser();
        }
    }

    uninitUsersManager() {
        this.usersManager = null;
    }

    selectFile(e: React.FormEvent<HTMLInputElement>) {
        if(e.currentTarget.files.length != 0) {
            // Do parsing
            let selectedFile = e.currentTarget.files[0];
            console.log(extractSeriesInfo(selectedFile.name));
            this.setState({loadState: LoadState.Loading, showReport: false});
            let reader = new FileReader();
            reader.onload = (e) => {
                try {
                    let p = Subtitle.parse(reader.result);
                    if(p.length == 0) {
                        this.setState({subs: p, loadState: LoadState.NotLoaded});
                        this.uninitUsersManager();
                        alert("Empty srt file");
                    } else {
                        let seriesInfo = extractSeriesInfo(selectedFile.name);
                        this.initUsersManager(p.length);
                        this.setState({subs: p, seriesInfo: seriesInfo, loadState: LoadState.Loaded});
                    }
                }
                catch(e) {
                    this.setState({subs: [], seriesInfo: {seriesName: ""}, loadState: LoadState.NotLoaded});
                    this.uninitUsersManager();
                    alert("Invalid srt file");
                }
            };
            reader.readAsText(selectedFile);
        }
        else {
            this.setState({subs: [], seriesInfo: {seriesName: ""}, loadState: LoadState.NotLoaded});
        }
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let filename = makeFilename(this.state.seriesInfo);
        let nameGen = function(user: User, start: number, end: number): string {
            return `${filename}.${start}-${end}.${user.name}.srt`;
        };

        splitSubsInZipArchive(nameGen, this.state.subs, this.state.users).then((blob) => {
            saveAs(blob, `${filename}.zip`);
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
                    <br/>
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

