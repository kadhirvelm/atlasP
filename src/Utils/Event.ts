import { IEvent } from "../Types/Events";
import { IUser } from "../Types/Users";

export default class Event implements IEvent {
    constructor(public id: string, public host: IUser, public date: string, public description: string, public attendees: IUser[]) {}
}
