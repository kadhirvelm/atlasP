import { IFilter } from "../../../../Types/Graph";
import { getDifferenceBetweenDates } from "../../../../Utils/Util";
import { GREEN_DAYS, RED_DAYS } from "../../../DisplayGraph/DisplayGraphUtils";

export const BLUE_FILTER: IFilter = {
    id: "blue",
    shouldRemove: (date: Date) => getDifferenceBetweenDates(new Date(), date) > 0,
    type: "date",
}

export const GREEN_FILTER: IFilter = {
    id: "green",
    shouldRemove: (date: Date) => {
        const days = getDifferenceBetweenDates(new Date(), date);
        return days < 0 || days > GREEN_DAYS;
    },
    type: "date",
};

export const YELLOW_FILTER: IFilter = {
    id: "yellow",
    shouldRemove: (date: Date) => {
        const days = getDifferenceBetweenDates(new Date(), date);
        return days < GREEN_DAYS || days > RED_DAYS;
    },
    type: "date",
};

export const RED_FILTER: IFilter = {
    id: "red",
    shouldRemove: (date: Date) => getDifferenceBetweenDates(new Date(), date) < RED_DAYS,
    type: "date",
};

export const DATE_FILTERS = [ BLUE_FILTER, GREEN_FILTER, YELLOW_FILTER, RED_FILTER ];
