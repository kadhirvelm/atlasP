export interface IRawUser {
  _id: string;
  connections: IConnections;
  claimed: boolean;
  gender: string;
  location: string;
  name: string;
  phoneNumber: string;
}

export interface IUser {
  connections?: IConnections;
  contact: string;
  gender: string;
  greenList?: string[];
  id: string;
  location: string;
  name: string;
  password?: string;
  redList?: string[];
}

export interface IConnections { [key: string]: string[] }
