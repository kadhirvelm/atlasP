export interface IRawUser {
  _id: string;
  connections: IConnections;
  claimed: boolean;
  gender: string;
  location: string;
  ignoreUsers?: string[];
  name: string;
  phoneNumber: string;
}

export type IPersonFrequency = number | "IGNORE" | undefined;

export interface IFrequency {
  [id: string]: IPersonFrequency;
}

export interface IUser {
  claimed: boolean;
  connections?: IConnections;
  contact: string;
  frequency?: IFrequency;
  gender: string;
  id: string;
  location: string;
  name: string;
  password?: string;
}

export interface IConnections {
  [key: string]: string[];
}
