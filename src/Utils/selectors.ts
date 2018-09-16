import { createSelector } from "reselect";

import IStoreState from "../State/IStoreState";
import { IEventMap } from "../Types/Events";
import { IUser, IUserMap } from "../Types/Users";
import Event from "./Event";

export interface ILink {
  source: string;
  target: string;
  strength: number;
}

export interface IDateMap {
  [id: string]: Date;
}

export interface IPeopleGraph {
  nodes: IUser[];
  links: ILink[];
  lastEvents: IDateMap;
}

const STRENGTH_DIVIDER = 25;

export const selectMainPersonGraph = createSelector(
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (state: IStoreState) => state.DatabaseReducer.userData,
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (
    mainPerson: IUser | undefined,
    allUsers: IUserMap | undefined,
    allEvents: IEventMap | undefined
  ): IPeopleGraph | undefined => {
    if (
      mainPerson === undefined ||
      mainPerson.connections === undefined ||
      allUsers === undefined ||
      allEvents === undefined
    ) {
      return undefined;
    }

    const connectionCopy = { ...mainPerson.connections };
    delete connectionCopy[mainPerson.id];

    const links = Object.entries(connectionCopy).map(userAndEvents => ({
      source: mainPerson.id,
      strength: userAndEvents[1].length / STRENGTH_DIVIDER,
      target: userAndEvents[0],
    }));
    const lastEvents = {};

    for (const key in connectionCopy) {
      if (connectionCopy.hasOwnProperty(key)) {
        const eventId = connectionCopy[key].slice(-1)[0];
        lastEvents[key] = eventId === undefined ? undefined : allEvents[eventId].date;
      }
    }

    return { nodes: Object.values(allUsers), links, lastEvents };
  }
);

export const selectSortedEvents = createSelector(
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (eventData: IEventMap | undefined) => {
    if (eventData === undefined) {
      return [];
    }
    return Object.values(eventData).sort(
      (a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
);
