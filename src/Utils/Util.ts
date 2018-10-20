import { PhoneNumberUtil } from "google-libphonenumber";

import { IEvent } from "../Types/Events";
import { IUser } from "../Types/Users";
import User from "./User";

const phoneUtils = new PhoneNumberUtil();

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
  return itemArray.map(item => ({ [item.id]: item })).reduce((previous, next) => ({ ...previous, ...next }), {})
}

export function convertPayloadToUser(rawUser: any) {
  if (rawUser === undefined) {
    return undefined;
  }
  return new User(rawUser._id, rawUser.name, rawUser.gender, rawUser.location, rawUser.phoneNumber, [], [], rawUser.connections);
}

export function isValidPhoneNumber(rawNumber: string) {
  try {
      return phoneUtils.isValidNumber(phoneUtils.parse(rawNumber, "US"));
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
  const selfIndex = (value: any, index: number, self: any[]) => self.indexOf(value) === index;
  return array.filter(selfIndex);
}

export const getLatestEventDate = (events: IEvent[]) => events.sort((a, b) => getDifferenceBetweenDates(a.date, b.date)).slice(-1)[0];
