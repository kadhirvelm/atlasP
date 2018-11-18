import { IFilter } from "../../../../Types/Graph";
import { IUser } from "../../../../Types/Users";
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

export const IGNORE_FILTER: IFilter = {
  id: "ignore_filter",
  shouldKeep: (user: IUser, currentUser?: IUser) => {
    if (currentUser === undefined || currentUser.ignoreUsers === undefined) {
      return true;
    }
    return !currentUser.ignoreUsers.includes(user.id);
  },
  type: "user"
};
