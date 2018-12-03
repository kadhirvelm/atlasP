import { IFilter } from "../../../../Types/Graph";
import { IPersonFrequency, IUser } from "../../../../Types/Users";
import {
  finalRelationshipDays,
  getDifferenceBetweenDates
} from "../../../../Utils/Util";

export const BLUE_FILTER: IFilter = {
  id: "blue",
  shouldKeep: (date: Date) => getDifferenceBetweenDates(new Date(), date) > 0,
  type: "date"
};

export const GREEN_FILTER: IFilter = {
  id: "green",
  shouldKeep: (date: Date, relationship: IPersonFrequency) => {
    const finalRelationship = finalRelationshipDays(relationship);
    const days = getDifferenceBetweenDates(new Date(), date);
    return days < 0 || days > finalRelationship;
  },
  type: "date"
};

export const YELLOW_FILTER: IFilter = {
  id: "yellow",
  shouldKeep: (date: Date, relationship: IPersonFrequency) => {
    const finalRelationship = finalRelationshipDays(relationship);
    const days = getDifferenceBetweenDates(new Date(), date);
    return days < finalRelationship || days > finalRelationship * 3;
  },
  type: "date"
};

export const RED_FILTER: IFilter = {
  id: "red",
  shouldKeep: (date: Date, relationship: IPersonFrequency) => {
    const finalRelationship = finalRelationshipDays(relationship);
    const days = getDifferenceBetweenDates(new Date(), date);
    return days < finalRelationship * 3;
  },
  type: "date"
};

export const DATE_FILTERS = [
  BLUE_FILTER,
  GREEN_FILTER,
  YELLOW_FILTER,
  RED_FILTER
];

export const IGNORE_FILTER: IFilter = {
  id: "ignore",
  shouldKeep: (_: IUser, relationship: IPersonFrequency) => {
    return relationship !== "IGNORE";
  },
  type: "user"
};
