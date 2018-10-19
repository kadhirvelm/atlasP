import { createSelector } from "reselect";

import IStoreState from "../State/IStoreState";
import { IEventMap } from "../Types/Events";
import { IFilter } from "../Types/Graph";
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

export interface IFilteredNodes {
  nodes: IUser[];
  lastEvents: IDateMap;
  connectionCopy: IConnections;
}

export interface IPeopleGraph {
  nodes: IUser[];
  lastEvents: IDateMap;
  links: ILink[];
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
  Object.keys(connectionCopy).forEach((key) => {
      const eventId = connectionCopy[key].slice(-1)[0];
      lastEvents[key] = eventId === undefined ? undefined : allEvents[eventId].date;
  });
  return lastEvents;
}

export const selectConnectionsAndDates = createSelector(
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (state: IStoreState) => state.DatabaseReducer.userData,
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (
    mainPerson: IUser | undefined,
    allUsers: IUserMap | undefined,
    allEvents: IEventMap | undefined,
  ): IFilteredNodes | undefined => {
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

    return {
      connectionCopy,
      lastEvents: returnLastEvent(connectionCopy, allEvents),
      nodes: Object.values(allUsers),
    };
  }
);

export const selectFilteredConnections = createSelector(
  selectConnectionsAndDates,
  (state: IStoreState) => state.WebsiteReducer.graphFilters,
  (
    filteredNodes: IFilteredNodes | undefined,
    graphFilter: IFilter[] | undefined,
  ): IFilteredNodes | undefined => {
    if (filteredNodes === undefined || graphFilter === undefined) {
      return filteredNodes;
    }

    const filteredNodesCopy = { ...filteredNodes };
    const connectionCopy = { ...filteredNodes.connectionCopy };
  
    graphFilter.forEach((filter) => {
      filteredNodesCopy.nodes = filteredNodesCopy.nodes.filter((user) => {
        const check = filter.type === "date" ? filteredNodesCopy.lastEvents[user.id] : user;
        if (check === undefined) {
          return true;
        }
        const shouldKeep = filter.shouldRemove(check);
        if (!shouldKeep) {
          delete connectionCopy[user.id];
        }
        return shouldKeep;
      });
    });

    return { ...filteredNodesCopy, connectionCopy };
  }
);

export const selectMainPersonGraph = createSelector(
  selectFilteredConnections,
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (filteredNodes: IFilteredNodes, mainPerson: IUser | undefined): IPeopleGraph | undefined => {
    if (filteredNodes === undefined || mainPerson === undefined) {
      return undefined;
    }

    return {
      lastEvents: filteredNodes.lastEvents,
      links: returnNormalizedLinks(mainPerson.id, filteredNodes.connectionCopy),
      nodes: filteredNodes.nodes,
    };
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
      infoPerson === undefined ||
      mainPerson.connections[infoPerson.id] === undefined
    ) {
      return undefined;
    }
    return mainPerson.connections[infoPerson.id].map(id => eventData[id]).sort(sortDate);
  }
);
