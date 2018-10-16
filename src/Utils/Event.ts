import { IEvent } from "../Types/Events";
import { IUser } from "../Types/Users";

export default class Event implements IEvent {
    constructor(public id: string, public date: Date, public description: string, public attendees: IUser[]) {}

    public isEqual(event: IEvent | undefined) {
        if (event === undefined) {
            return false;
        }

        const attendeesMapped = event.attendees.map(user => user.id);
        const currentAttendeesMapped = this.attendees.map(user => user.id);
        return event.id === this.id && event.date.getTime() === this.date.getTime() && event.description === this.description && attendeesMapped.every(userId => currentAttendeesMapped.includes(userId));
    }
}
