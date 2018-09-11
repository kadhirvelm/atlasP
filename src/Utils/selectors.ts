import { createSelector } from "reselect";

import IStoreState, { IEventMap } from "../State/IStoreState";
import { IUserMap } from "../Types/Users";
import Event from "./Event";
import User from "./User";

const MAX_RADIANS = 2 * Math.PI;
const RADIUS = 42;
export const ORIGIN = { x: 50, y: 50 };
const ADJUST_CIRCLE = -(Math.PI / 2);

export interface ISingleLine {
  fromHost?: boolean;
  toHost?: boolean;
  red?: boolean;
  green?: boolean;
}

export interface ILines {
  id?: ISingleLine;
}

export interface ISingleLocation {
  x: number;
  y: number;
}

export interface ILocation {
  id?: ISingleLocation;
}

export interface IPeopleGraph {
  mainPerson: User;
  connections: ILines;
  dimension: number;
  locations: ILocation;
}

const selectMainPerson = (state: IStoreState) => state.WebsiteReducer.mainPerson;

export const selectMainPersonLines = createSelector(
  selectMainPerson,
  (mainPerson: User): ILines => {
    const connections = {};
    mainPerson.redList.map(
      singlePerson => (connections[singlePerson] = { fromHost: true, red: true })
    );
    mainPerson.greenList.map(
      singlePerson => (connections[singlePerson] = { fromHost: true, green: true })
    );
    return connections;
  }
);

export const selectMainPersonConnectionLines = createSelector(
  selectMainPerson,
  selectMainPersonLines,
  (state: IStoreState) => state.GoogleReducer.userData,
  (mainPerson: User, connections: ILines, userData: IUserMap) => {
    Object.keys(mainPerson.connections).map((userID: string) => {
      const user = userData[userID];
      if (user.redList && user.redList.includes(mainPerson.id)) {
        connections[user.id] = { ...connections[user.id], toHost: true, red: true };
      }
      if (user.greenList && user.greenList.includes(mainPerson.id)) {
        connections[user.id] = { ...connections[user.id], toHost: true, green: true };
      }
    });
    return connections;
  }
);

export const selectConnectionLocations = createSelector(
  selectMainPerson,
  (state: IStoreState) => state.GoogleReducer.userData,
  (mainPerson: User, users: IUserMap | undefined): ILocation => {
    if (users === undefined) {
      return {};
    }

    const locations = {};
    const totalConnections = Object.keys(mainPerson.connections).length;

    const returnPositionOnCircle = (
      origin: number,
      mathFunction: (position: number) => number,
      index: number
    ) => {
      return (
        origin + mathFunction((MAX_RADIANS / totalConnections) * index + ADJUST_CIRCLE) * RADIUS
      );
    };

    Object.keys(mainPerson.connections)
      .sort((a: string, b: string) => users[a].fullName.localeCompare(users[b].fullName))
      .map((userID: string, index: number) => {
        locations[userID] = {
          x: returnPositionOnCircle(ORIGIN.x, Math.cos, index),
          y: returnPositionOnCircle(ORIGIN.y, Math.sin, index)
        };
      });
    return locations;
  }
);

export const selectMainPersonGraph = createSelector(
  selectMainPerson,
  selectMainPersonConnectionLines,
  selectConnectionLocations,
  (mainPerson: User, connections: ILines, locations: ILocation): IPeopleGraph => {
    const dimension = -Object.keys(mainPerson.connections).length / 2.25 + 19;
    return { mainPerson, connections, dimension, locations };
  }
);

export const selectSortedEvents = createSelector(
  (state: IStoreState) => state.WebsiteReducer.mainPerson,
  (state: IStoreState) => state.GoogleReducer.eventData,
  (mainPerson: User | undefined, eventData: IEventMap | undefined) => {
    if (mainPerson === undefined || eventData === undefined) {
      return [];
    }
    return Object.values(eventData)
      .filter((event: Event) => event.attendees.includes(mainPerson.id))
      .sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
);
