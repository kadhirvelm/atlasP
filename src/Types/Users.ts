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
    age: number;
    contact: string;
    events: object;
    fullName: string;
    gender: string;
    greenList: string[];
    id: string;
    location: string;
    name: string;
    password?: string;
    redList: string[];
}

export interface IUserMap {
    id?: IUser;
}
