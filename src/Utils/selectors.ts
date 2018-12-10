import { createSelector } from "reselect";

import {
  LINK_DEFAULT_OPACITY,
  LINK_DEFAULT_STROKE_WIDTH
} from "../Components/Navbar/NavbarComponents/GraphType/GraphConstants";
import IStoreState from "../State/IStoreState";
import { IEvent } from "../Types/Events";
import { IFilter, IGraphType, ILink } from "../Types/Graph";
import { IPersonFrequency, IUser } from "../Types/Users";
import {
  convertObjectToMap,
  finalRelationshipDays,
  getDifferenceBetweenDates,
  getLatestEventDate
} from "./Util";

export interface IFilteredNodes {
  nodes: IUser[];
  lastEvents: Map<string, Date>;
  connectionEvents: Map<string, IEvent[]>;
}

export type IRelationship = Map<string, IPersonFrequency>;

export interface IPeopleGraph {
  nodes: IUser[];
  lastEvents: Map<string, Date>;
  links: ILink[];
}

function returnLastEvents(connectionCopy: Map<string, IEvent[]>) {
  const lastEvents = new Map();
  Array.from(connectionCopy.keys()).forEach(id => {
    const events = connectionCopy.get(id) as IEvent[];
    const lastEvent =
      events.length === 0 ? undefined : getLatestEventDate(events).date;
    lastEvents.set(id, lastEvent);
  });
  return lastEvents;
}

export const selectConnectionsAndDates = createSelector(
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (state: IStoreState) => state.DatabaseReducer.userData,
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (
    mainPerson: IUser | undefined,
    allUsers: Map<string, IUser> | undefined,
    allEvents: Map<string, IEvent> | undefined
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

    const connectionEvents: Map<string, IEvent[]> = new Map();
    for (const key of Object.keys(connectionCopy)) {
      connectionEvents.set(
        key,
        connectionCopy[key].map(id => allEvents.get(id) as IEvent)
      );
    }

    return {
      connectionEvents,
      lastEvents: returnLastEvents(connectionEvents),
      nodes: Array.from(allUsers.values())
    };
  }
);

export const selectRelationships = createSelector(
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (mainPerson: IUser | undefined) => {
    if (mainPerson === undefined) {
      return new Map();
    }

    return convertObjectToMap(mainPerson.frequency || {});
  }
);

export const selectFilteredConnections = createSelector(
  selectConnectionsAndDates,
  selectRelationships,
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (state: IStoreState) => state.WebsiteReducer.graphFilters,
  (
    filteredNodes: IFilteredNodes | undefined,
    relationships: IRelationship,
    currentUser: IUser | undefined,
    graphFilter: IFilter[] | undefined
  ): IFilteredNodes | undefined => {
    if (
      filteredNodes === undefined ||
      graphFilter === undefined ||
      currentUser === undefined
    ) {
      return filteredNodes;
    }

    const filteredNodesCopy = { ...filteredNodes };
    const connectionEvents = new Map(filteredNodes.connectionEvents);

    graphFilter.forEach(filter => {
      filteredNodesCopy.nodes = filteredNodesCopy.nodes.filter(user => {
        if (user.id === currentUser.id) {
          return true;
        }

        const check =
          filter.type === "date"
            ? filteredNodesCopy.lastEvents.get(user.id)
            : user;
        if (check === undefined) {
          return true;
        }

        const shouldKeep = filter.shouldKeep(
          check,
          relationships.get(user.id),
          currentUser
        );
        if (!shouldKeep) {
          connectionEvents.delete(user.id);
        }

        return shouldKeep;
      });
    });

    return { ...filteredNodesCopy, connectionEvents };
  }
);

export const selectLinkedConnections = createSelector(
  selectFilteredConnections,
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (state: IStoreState) => state.WebsiteReducer.graphType,
  (
    filteredNodes: IFilteredNodes | undefined,
    mainPerson: IUser | undefined,
    graphType: IGraphType
  ): IPeopleGraph | undefined => {
    if (filteredNodes === undefined || mainPerson === undefined) {
      return undefined;
    }

    return {
      lastEvents: filteredNodes.lastEvents,
      links: graphType.generateLinks(
        mainPerson.id,
        filteredNodes.connectionEvents
      ),
      nodes: filteredNodes.nodes
    };
  }
);

const resetLink = (link: ILink) => {
  link.color = "black";
  link.opacity = LINK_DEFAULT_OPACITY;
  link.strokeWidth = LINK_DEFAULT_STROKE_WIDTH;
};

const setLink = (link: ILink, totalHits: number) => {
  link.color = totalHits === 1 ? "#7D6608" : "#6E2C00";
  link.opacity = totalHits === 1 ? 0.75 : 1;
  link.strokeWidth = totalHits === 1 ? 2 : 4;
};

const hasHighlight = (link: any, highlights: Set<string>) =>
  highlights.has(link) || highlights.has(link.id) ? 1 : 0;

export const selectMainPersonGraph = createSelector(
  selectLinkedConnections,
  (state: IStoreState) => state.WebsiteReducer.highlightConnections,
  (
    linkedGraph: IPeopleGraph | undefined,
    highlightConnections: Set<string>
  ): IPeopleGraph | undefined => {
    if (linkedGraph === undefined) {
      return undefined;
    }

    const resetLinks = linkedGraph.links.map(link => ({
      ...link,
      color: undefined,
      opacity: undefined,
      strokeWidth: undefined
    }));

    return {
      ...linkedGraph,
      links: resetLinks.map(link => {
        const targetHasHighlight = hasHighlight(
          link.target,
          highlightConnections
        );
        const sourceHasHighlight = hasHighlight(
          link.source,
          highlightConnections
        );
        if (!targetHasHighlight && !sourceHasHighlight) {
          resetLink(link);
        } else {
          setLink(link, targetHasHighlight + sourceHasHighlight);
        }
        return link;
      })
    };
  }
);

const getHealth = (
  eventDate: Date | undefined,
  relationship: IPersonFrequency | undefined
): number => {
  if (eventDate === undefined) {
    return 0;
  }

  const totalDifference = getDifferenceBetweenDates(
    new Date(),
    new Date(eventDate)
  );
  const frequencyInDays = finalRelationshipDays(relationship);
  if (totalDifference < frequencyInDays) {
    return 1;
  } else if (totalDifference < frequencyInDays * 3) {
    return 0.5;
  }
  return 0;
};

export const selectGraphHealth = createSelector(
  selectFilteredConnections,
  selectRelationships,
  (filteredNodes: IFilteredNodes | undefined, relationships: IRelationship) => {
    if (filteredNodes === undefined) {
      return undefined;
    }
    const totalScore = filteredNodes.nodes
      .map(node =>
        getHealth(
          filteredNodes.lastEvents.get(node.id),
          relationships.get(node.id)
        )
      )
      .reduce((previous, next) => previous + next, 0);
    return Math.round((totalScore / filteredNodes.nodes.length) * 100);
  }
);

const sortDate = (a: IEvent, b: IEvent) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export const selectSortedEvents = createSelector(
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (eventData: Map<string, IEvent> | undefined) => {
    if (eventData === undefined) {
      return [];
    }
    return Array.from(eventData.values()).sort(sortDate);
  }
);

export const selectInfoPersonSortedEvents = createSelector(
  (state: IStoreState) => state.DatabaseReducer.currentUser,
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (state: IStoreState) => state.WebsiteReducer.infoPerson,
  (
    mainPerson: IUser | undefined,
    eventData: Map<string, IEvent> | undefined,
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
    return mainPerson.connections[infoPerson.id]
      .map(id => eventData.get(id) as IEvent)
      .sort(sortDate);
  }
);

export const selectInfoPerson = createSelector(
  (state: IStoreState) => state.DatabaseReducer.userData,
  (state: IStoreState) => state.WebsiteReducer.infoPerson,
  (userData: Map<string, IUser> | undefined, infoPerson: IUser | undefined) => {
    if (userData === undefined || infoPerson === undefined) {
      return undefined;
    }
    return userData.get(infoPerson.id);
  }
);
