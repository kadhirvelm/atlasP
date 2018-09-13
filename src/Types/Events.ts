import { IUser } from "./Users";

export interface IEvent {
  attendees: IUser[];
  id: string;
  host: IUser;
  date: string;
  description: string;
}

export interface IEventMap {
  [id: string]: IEvent;
}
