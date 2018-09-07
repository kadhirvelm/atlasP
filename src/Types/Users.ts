export interface IForceUpdate {
    _id: string;
    fields: Pick<IRawUser, "age" | "gender" | "location" | "name" | "phoneNumber"> | "password";
}

export interface IRawUser {
    _id: string;
    age: number;
    claimed: boolean;
    gender: string;
    location: string;
    name: string;
    phoneNumber: string;
}

export interface IUser {
    id: string;
    name: string;
    fullName: string;
    gender: string;
    age: number;
    location: string;
    contact: string;
    redList: string[];
    greenList: string[];
    events: object;
}

export interface IUserMap {
    id?: IUser;
}