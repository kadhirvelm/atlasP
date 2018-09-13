import { IEvent } from "../Types/Events";
import { IUser } from "../Types/Users";

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