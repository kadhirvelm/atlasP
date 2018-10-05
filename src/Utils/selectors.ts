import { createSelector } from "reselect";

import IStoreState from "../State/IStoreState";
import { IEventMap } from "../Types/Events";
import { IConnections, IUser, IUserMap } from "../Types/Users";
import Event from "./Event";

export interface ILink {
  distance: number;
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

const STRENGTH_DIVIDER = 100;
const DISTANCE_MULTIPLIER = 100;

function returnNormalizedLinks(
  source: string,
  connectionCopy: IConnections,
  applyStrength: boolean = false
) {
  let normalization = 0;
  let maximum = 0;
  const links = Object.entries(connectionCopy).map(userAndEvents => {
    normalization += userAndEvents[1].length;
    maximum = Math.max(maximum, userAndEvents[1].length);
    return {
      distance: userAndEvents[1].length,
      source,
      strength: userAndEvents[1].length,
      target: userAndEvents[0]
    };
  });
  normalization = (normalization * STRENGTH_DIVIDER) / Object.keys(connectionCopy).length;
  return links.map(userAndEvents => ({
    ...userAndEvents,
    distance: (maximum + 1 - userAndEvents.distance) * DISTANCE_MULTIPLIER,
    strength: applyStrength ? userAndEvents.strength / normalization : 0.5
  }));
}

function returnLastEvent(connectionCopy: IConnections, allEvents: IEventMap) {
  const lastEvents = {};
  for (const key in connectionCopy) {
    if (connectionCopy.hasOwnProperty(key)) {
      const eventId = connectionCopy[key].slice(-1)[0];
      lastEvents[key] = eventId === undefined ? undefined : allEvents[eventId].date;
    }
  }
  return lastEvents;
}

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

    const links = returnNormalizedLinks(mainPerson.id, connectionCopy);
    const lastEvents = returnLastEvent(connectionCopy, allEvents);

    return { nodes: Object.values(allUsers), links, lastEvents };
  }
);

const sortDate = (a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime();

export const selectSortedEvents = createSelector(
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (eventData: IEventMap | undefined) => {
    if (eventData === undefined) {
      return [];
    }
    return Object.values(eventData).sort(sortDate);
  }
);

export const selectInfoPersonSortedEvents = createSelector(
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (state: IStoreState) => state.WebsiteReducer.infoPerson,
  (
    mainPerson: IUser | undefined,
    eventData: IEventMap | undefined,
    infoPerson: IUser | undefined
  ) => {
    if (
      mainPerson === undefined ||
      mainPerson.connections === undefined ||
      eventData === undefined ||
      infoPerson === undefined
    ) {
      return undefined;
    }
    return mainPerson.connections[infoPerson.id].map(id => eventData[id]).sort(sortDate);
  }
);
