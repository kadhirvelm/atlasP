import { TypedAction } from "redoodle";

export interface IRawUser {
    _id: string;
    age: number;
    claimed: boolean;
    gender: string;
    location: string;
    name: string;
    phoneNumber: string;
}

export const Login = TypedAction.define("DatabaseActions//LOGIN")<IRawUser>();

export const EmptyDatabaseCache = TypedAction.defineWithoutPayload("WebsiteReducer//EMPTY_DATABASE_CACHE")();
