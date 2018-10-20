import { IFilter } from "../../../../Types/Graph";
import { getDifferenceBetweenDates } from "../../../../Utils/Util";
import { GREEN_DAYS, RED_DAYS } from "../../../DisplayGraph/DisplayGraphUtils";

export const GREEN_FILTER_ID = "GREEN_DATE_FILTER";
export const GREEN_FILTER: IFilter = {
    id: GREEN_FILTER_ID,
    shouldRemove: (date: Date) => getDifferenceBetweenDates(new Date(), date) > GREEN_DAYS,
    type: "date",
};

export const YELLOW_FILTER_ID = "YELLOW_DATE_FILTER";
export const YELLOW_FILTER: IFilter = {
    id: YELLOW_FILTER_ID,
    shouldRemove: (date: Date) => {
        const days = getDifferenceBetweenDates(new Date(), date);
        return days < GREEN_DAYS || days > RED_DAYS;
    },
    type: "date",
};

export const RED_FILTER_ID = "RED_DATE_FILTER";
export const RED_FILTER: IFilter = {
    id: RED_FILTER_ID,
    shouldRemove: (date: Date) => getDifferenceBetweenDates(new Date(), date) < RED_DAYS,
    type: "date",
};
