import Event from './Event';
import User from './User';

const extractIntoNumberArray = (rawNumbers: string): number[] => {
    return rawNumbers.split(',').map((rawNumber) => parseInt(rawNumber, 10));
}

export function assembleObjects(userData: string[][], eventData: string[][]): object {
    const finalEventsData = {};
    const finalUserData = {};

    eventData.slice(1).forEach((event: string[]) => {
        const newEvent = new Event(parseInt(event[0], 10), parseInt(event[1], 10), event[2]);
        finalEventsData[newEvent.id] = newEvent;
    });
    userData.slice(1).map((person: string[]) => {
        const newUser = new User(
            parseInt(person[0], 10), 
            person[1],
            person[2],
            parseInt(person[3], 10),
            person[4],
            person[5],
            extractIntoNumberArray(person[6]),
            extractIntoNumberArray(person[7]),
            extractIntoNumberArray(person.slice(8).join(',')));
        finalUserData[newUser.id] = newUser;
        newUser.events.forEach((event: number) => {
            finalEventsData[event].attendees.push(newUser.id);
        });
    });
    (Object as any).values(finalEventsData).forEach((singleEvent: Event) => {
        const allAttendees = singleEvent.attendees;
        const eventID = singleEvent.id;
        allAttendees.forEach((userID: number) => {
            finalUserData[userID].addMultipleConnections(allAttendees, eventID);
        })
    })

    return finalUserData;
}
