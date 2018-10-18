export interface User {
    name: string
    partSize: number
}

type UpdateFn = (users:Array<User>) => void;

export class UsersManager {
    users: Array<User>;
    subsCount: number;
    update: UpdateFn;
    constructor(users: Array<User>, subsCount: number, update: UpdateFn) {
        this.users = users;
        this.subsCount = subsCount;
        this.update = update;
    }

    addUser(): boolean {
        if(this.users.length >= this.subsCount) {
            return false;
        }
        else {
            this.users.push({ name: '', partSize: 0 });
            this.updateDivisions();
            this.update(this.users);
            return true;
        }
    }

    removeUser(index: number): boolean {
        if(this.users.length > 1) {
            this.users.splice(index, 1);
            this.updateDivisions();
            this.update(this.users);
            return true;
        }
        else {
            return false;
        }
    }

    updateUser(index: number, newName: string) {
        this.users[index].name = newName;
        this.update(this.users);
    }

    jsonify(): string {
        let arr = [];
        for(let i = 0; i < this.users.length; i++) {
            let obj = { name: this.users[i].name };
            arr.push(obj);
        }
        return JSON.stringify(arr);
    }

    private updateDivisions() {
        let newDivisions = this.makeDivisions();
        // Update divisions
        for(let i = 0; i < this.users.length; i++) {
            this.users[i].partSize = newDivisions[i];
        }
    }

    private makeDivisions(): Array<number> {
        let subsPerUser: number = Math.floor(this.subsCount / this.users.length);
        let remainder: number = this.subsCount - subsPerUser * this.users.length;
        console.log(this.subsCount, subsPerUser, remainder);

        let divisions = [];
        for(let i = 0; i < this.users.length; i++) {
            let partSize = subsPerUser;
            if(i < remainder) {
                partSize += 1;
            }
            divisions.push(partSize);
        }

        return divisions;
    }
}

