import { IFilter } from "../../../../Types/Graph";
import { IUser } from "../../../../Types/Users";
import {
  ALL_VALID_CATEGORIES,
  IValidCategories
} from "../../../../Utils/selectors";
import { getDifferenceBetweenDates } from "../../../../Utils/Util";
import { GREEN_DAYS, RED_DAYS } from "../../../DisplayGraph/DisplayGraphUtils";

export const BLUE_FILTER: IFilter = {
  id: "blue",
  shouldKeep: (date: Date) => getDifferenceBetweenDates(new Date(), date) > 0,
  type: "date"
};

export const GREEN_FILTER: IFilter = {
  id: "green",
  shouldKeep: (date: Date) => {
    const days = getDifferenceBetweenDates(new Date(), date);
    return days < 0 || days > GREEN_DAYS;
  },
  type: "date"
};

export const YELLOW_FILTER: IFilter = {
  id: "yellow",
  shouldKeep: (date: Date) => {
    const days = getDifferenceBetweenDates(new Date(), date);
    return days < GREEN_DAYS || days > RED_DAYS;
  },
  type: "date"
};

export const RED_FILTER: IFilter = {
  id: "red",
  shouldKeep: (date: Date) =>
    getDifferenceBetweenDates(new Date(), date) < RED_DAYS,
  type: "date"
};

export const DATE_FILTERS = [
  BLUE_FILTER,
  GREEN_FILTER,
  YELLOW_FILTER,
  RED_FILTER
];

export const CATEGORY_FILTER = (category: IValidCategories): IFilter => {
  return {
    id: `${category}_filter`,
    shouldKeep: (user: IUser, currentUser?: IUser) => {
      if (currentUser === undefined || currentUser[category] === undefined) {
        return true;
      }
      return !(currentUser[category] as string[]).includes(user.id);
    },
    type: "user"
  };
};

export const NOT_IN_CATEGORY_FILTER: IFilter = {
  id: `no_category_filter`,
  shouldKeep: (user: IUser, currentUser?: IUser) => {
    for (const category of ALL_VALID_CATEGORIES) {
      if (
        currentUser !== undefined &&
        currentUser[category] !== undefined &&
        (currentUser[category] as string[]).includes(user.id)
      ) {
        return true;
      }
    }
    return currentUser !== undefined && user.id === currentUser.id;
  },
  type: "user"
};
