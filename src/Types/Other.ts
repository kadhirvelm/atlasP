import { IUser } from "./Users";

export interface IForceUpdate {
  _id: string;
  fields: keyof IUser;
}
