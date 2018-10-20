import { createSelector } from "reselect";

import IStoreState from "../State/IStoreState";
import { IEvent, IEventMap } from "../Types/Events";
import { IFilter, IGraphType, ILink } from "../Types/Graph";
import { IUser, IUserMap } from "../Types/Users";
import Event from "./Event";
import { getLatestEventDate } from "./Util";

export interface IDateMap {
  [id: string]: Date;
}

export interface IConnectionEvents {
  [key: string]: IEvent[];
}

export interface IFilteredNodes {
  nodes: IUser[];
  lastEvents: IDateMap;
  connectionEvents: IConnectionEvents;
}

export interface IPeopleGraph {
  nodes: IUser[];
  lastEvents: IDateMap;
  links: ILink[];
}

function returnLastEvents(connectionCopy: IConnectionEvents) {
  const lastEvents = {};
  Object.keys(connectionCopy).forEach((key) => {
      const events = connectionCopy[key];
      lastEvents[key] = events.length === 0 ? undefined : getLatestEventDate(events).date;
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

    const connectionEvents: IConnectionEvents = {};
    for (const key of Object.keys(connectionCopy)) {
      connectionEvents[key] = connectionCopy[key].map((id) => allEvents[id]);
    }

    return {
      connectionEvents,
      lastEvents: returnLastEvents(connectionEvents),
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
    const connectionEvents = { ...filteredNodes.connectionEvents };
  
    graphFilter.forEach((filter) => {
      filteredNodesCopy.nodes = filteredNodesCopy.nodes.filter((user) => {
        const check = filter.type === "date" ? filteredNodesCopy.lastEvents[user.id] : user;
        if (check === undefined) {
          return true;
        }
        const shouldKeep = filter.shouldRemove(check);
        if (!shouldKeep) {
          delete connectionEvents[user.id];
        }
        return shouldKeep;
      });
    });

    return { ...filteredNodesCopy, connectionEvents };
  }
);

export const selectMainPersonGraph = createSelector(
  selectFilteredConnections,
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (state: IStoreState) => state.WebsiteReducer.graphType,
  (filteredNodes: IFilteredNodes, mainPerson: IUser | undefined, graphType: IGraphType): IPeopleGraph | undefined => {
    if (filteredNodes === undefined || mainPerson === undefined) {
      return undefined;
    }
    return {
      lastEvents: filteredNodes.lastEvents,
      links: graphType.generateLinks(mainPerson.id, filteredNodes.connectionEvents),
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
