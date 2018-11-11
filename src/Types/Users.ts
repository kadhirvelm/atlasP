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

export interface IUser {
  claimed: boolean;
  connections?: IConnections;
  contact: string;
  gender: string;
  id: string;
  ignoreUsers?: string[];
  location: string;
  name: string;
  password?: string;
}

export interface IConnections {
  [key: string]: string[];
}
