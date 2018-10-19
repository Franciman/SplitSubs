import * as JSZip from 'jszip'
import * as Subtitle from 'subtitle'
import { User } from './users-manager'

export type FileNameGenerator = (user: User, start: number, end: number) => string;

export function splitSubsInZipArchive(filenameGen: FileNameGenerator, subs: Array<any>, users: Array<User>): Promise<Blob> {
    let startPart = 0;
    let zip: JSZip = new JSZip();
    for(let i = 0; i < users.length; i++) {
        let part = subs.slice(startPart, startPart + users[i].partSize);
        let partText = Subtitle.stringify(part);

        let filename = filenameGen(users[i], startPart + 1, startPart + users[i].partSize);

        zip.file(filename, partText);

        startPart += users[i].partSize;
    }
    return zip.generateAsync({type: "blob"});
}

