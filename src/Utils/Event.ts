import { IEvent } from "../Types/Events";

export default class Event implements IEvent {
    public id: string;
    public host: number;
    public date: string;
    public attendees: string[];
    public description: string;

    constructor(id: string, host: number, date: string, description: string) {
        this.id = id;
        this.host = host;
        this.date = date;
        this.description = description;
        this.attendees = [];
    }
}
