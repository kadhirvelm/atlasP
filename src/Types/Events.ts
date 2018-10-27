import { IUser } from "./Users";

export interface IEvent {
  attendees: IUser[];
  id: string;
  date: Date;
  description: string;
}
