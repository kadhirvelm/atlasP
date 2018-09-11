import { IConnections, IUser } from "../Types/Users";

export default class User implements IUser {
    public name: string;

    constructor(
        public id: string,
        public fullName: string,
        public gender: string,
        public age: number,
        public location: string,
        public contact: string,
        public redList: string[],
        public greenList: string[],
        public events: string[],
        public connections: IConnections) {
        this.name = this.firstNameAndLastInitial(fullName);
    }

    private firstNameAndLastInitial = (name: string) => {
        const tempSeparate = name.split(" ");
        if (tempSeparate.length > 1) {
            return tempSeparate[0] + " " + tempSeparate[1][0];
        }
        return tempSeparate[0];
    }
}
