import PhoneNumber from "awesome-phonenumber";

import { IEvent } from "../Types/Events";
import { IPersonFrequency, IUser } from "../Types/Users";
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

export function convertArrayToMap<T extends IUser | IEvent>(
  itemArray: T[]
): Map<string, T> {
  const iteratable: Array<[string, T]> = itemArray.map(
    (item): [string, T] => [item.id, item]
  );
  return new Map(iteratable);
}

export function addToMap<T extends IUser | IEvent>(
  map: Map<string, T>,
  newValue: T
) {
  const newMapping = new Map(map);
  newMapping.set(newValue.id, newValue);
  return newMapping;
}

export function convertPayloadToUser(rawUser: any): IUser | undefined {
  if (rawUser === undefined) {
    return undefined;
  }
  return new User(
    rawUser._id,
    rawUser.name,
    rawUser.gender,
    rawUser.location,
    rawUser.phoneNumber,
    rawUser.claimed || false,
    rawUser.frequency,
    rawUser.connections
  );
}

export function isValidPhoneNumber(rawNumber: string) {
  try {
    return new PhoneNumber(rawNumber, "US").isValid();
  } catch (e) {
    return false;
  }
}

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export function getDifferenceBetweenDates(dateA: Date, dateB: Date) {
  if (dateA === undefined || dateB === undefined) {
    return 0;
  }
  return (dateA.getTime() - dateB.getTime()) / MILLISECONDS_PER_DAY;
}

export function distinctArray(array: any[]) {
  const selfIndex = (value: any, index: number, self: any[]) =>
    self.indexOf(value) === index;
  return array.filter(selfIndex);
}

export const getLatestEventDate = (events: IEvent[]) =>
  events.sort((a, b) => getDifferenceBetweenDates(a.date, b.date)).slice(-1)[0];

const DEFAULT_DAYS = 30;

export const finalRelationshipDays = (relationship: IPersonFrequency) => {
  return relationship === "IGNORE" || relationship === undefined
    ? DEFAULT_DAYS
    : relationship;
};
