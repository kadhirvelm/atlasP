interface IEvent {
    id: string;
    host: number;
    date: string;
    description: string;
}

export default class Event implements IEvent {
    public id: string;
    public host: number;
    public date: string;
    public attendees: number[];
    public description: string;

    constructor(id: string, host: number, date: string, description: string) {
        this.id = id;
        this.host = host;
        this.date = date;
        this.description = description;
        this.attendees = [];
    }
}
