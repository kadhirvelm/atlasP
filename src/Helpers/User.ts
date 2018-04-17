interface IUser {
    id: number,
    name: string,
    gender: string,
    age: number,
    location: string,
    email: string,
    redList: number[],
    greenList: number[],
    events: object,
}

export default class User implements IUser {
    public id: number;
    public name: string;
    public gender: string;
    public age: number;
    public location: string;
    public email: string;
    public redList: number[];
    public greenList: number[];
    public events: number[];
    public connections: object;

    constructor(id: number, name: string, gender: string, age: number, location: string, email: string, redList: number[], greenList: number[], events: number[]){
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.location = location;
        this.email = email;
        this.redList = redList;
        this.greenList = greenList;
        this.events = events;
        this.connections = {};
    }

    public addMultipleConnections(newConnections: number[], eventID: number){
        newConnections.forEach((singleNewConnection: number) => {
            this.addConnection(singleNewConnection, eventID);
        })
    }

    public addConnection(newConnection: number, eventID: number){
        if(newConnection !== this.id){
            this.connections[newConnection] = (this.connections[newConnection] || []).concat(eventID);
        }
    }
}