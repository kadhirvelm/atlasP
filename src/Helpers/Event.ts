interface IEvent {
    id: number,
    host: number,
    date: string,
}

export default class Event implements IEvent {
    public id: number;
    public host: number;
    public date: string;
    public attendees: number[];

    constructor(id: number, host: number, date: string){
        this.id = id;
        this.host = host;
        this.date = date;
        this.attendees = [];
    }
}