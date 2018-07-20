export interface IUser {
    id: number;
    name: string;
    fullName: string;
    gender: string;
    age: number;
    location: string;
    contact: string;
    redList: number[];
    greenList: number[];
    events: object;
}

export default class User implements IUser {
    public name: string;
    public connections: { id?: User };

    constructor(
        public id: number,
        public fullName: string,
        public gender: string,
        public age: number,
        public location: string,
        public contact: string,
        public redList: number[],
        public greenList: number[],
        public events: string[]) {
        this.name = this.firstNameAndLastInitial(fullName);
        this.connections = {};
    }

    public addMultipleConnections(newConnections: number[], eventID: number) {
        newConnections.forEach((singleNewConnection: number) => {
            this.addConnection(singleNewConnection, eventID);
        });
    }

    public addConnection(newConnection: number, eventID: number) {
        if (newConnection !== this.id) {
            this.connections[newConnection] = (this.connections[newConnection] || []).concat(eventID);
        }
    }

    private firstNameAndLastInitial = (name: string) => {
        const tempSeparate = name.split(" ");
        return tempSeparate[0] + " " + tempSeparate[1][0];
    }
}
