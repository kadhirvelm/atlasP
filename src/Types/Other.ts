import { IUser } from "./Users";

export interface IForceUpdate {
  _id: string;
  fields: keyof IUser;
}

export type IOpenNavbarDialog = "event" | undefined;
