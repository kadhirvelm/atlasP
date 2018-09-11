import { IUser } from "../Types/Users";

export default class User implements IUser {
    public name: string;
    public connections: { id?: User };

    constructor(
        public id: string,
        public fullName: string,
        public gender: string,
        public age: number,
        public location: string,
        public contact: string,
        public redList: string[],
        public greenList: string[],
        public events: string[]) {
        this.name = this.firstNameAndLastInitial(fullName);
        this.connections = {};
    }

    public addMultipleConnections(newConnections: string[], eventID: number) {
        newConnections.forEach((singleNewConnection: string) => {
            this.addConnection(singleNewConnection, eventID);
        });
    }

    public addConnection(newConnection: string, eventID: number) {
        if (newConnection !== this.id) {
            this.connections[newConnection] = (this.connections[newConnection] || []).concat(eventID);
        }
    }

    private firstNameAndLastInitial = (name: string) => {
        const tempSeparate = name.split(" ");
        if (tempSeparate.length > 1) {
            return tempSeparate[0] + " " + tempSeparate[1][0];
        }
        return tempSeparate[0];
    }
}
