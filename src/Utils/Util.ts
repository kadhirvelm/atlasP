import { IEvent } from "../Types/Events";
import { IUser } from "../Types/Users";
import User from "./User";

export function convertObjectToMap(object: {} | undefined): Map<string, {}> {
  const finalMap = new Map();

  if (object !== undefined) {
    Object.keys(object).forEach(key => {
      finalMap.set(key, object[key]);
    });
  }

  return finalMap;
}

export function convertArrayToObject<T extends IUser | IEvent>(itemArray: T[]) {
  return itemArray.map(item => ({ [item.id]: item })).reduce((previous, next) => ({ ...previous, ...next }))
}

export function convertPayloadToUser(rawUser: any) {
  if (rawUser === undefined) {
    return undefined;
  }
  return new User(rawUser._id, rawUser.name, rawUser.gender, rawUser.age, rawUser.location, rawUser.phoneNumber, [], [], rawUser.connections);
}