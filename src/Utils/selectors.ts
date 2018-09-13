import { createSelector } from "reselect";

import IStoreState from "../State/IStoreState";
import { IEventMap } from "../Types/Events";
import { IUser, IUserMap } from "../Types/Users";
import Event from "./Event";

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
  mainPerson: IUser;
  connections: ILines;
  dimension: number;
  locations: ILocation;
}

const selectMainPerson = (state: IStoreState) => state.DatabaseReducer.currentUser;

export const selectMainPersonLines = createSelector(
  selectMainPerson,
  (mainPerson: IUser | undefined): ILines => {
    if (mainPerson === undefined) {
      return {};
    }
    const connections = {};
    if (mainPerson.redList !== undefined) {
      mainPerson.redList.map(
        singlePerson => (connections[singlePerson] = { fromHost: true, red: true })
      );
    }
    if (mainPerson.greenList !== undefined) {
      mainPerson.greenList.map(
        singlePerson => (connections[singlePerson] = { fromHost: true, green: true })
      );
    }
    return connections;
  }
);

export const selectMainPersonConnectionLines = createSelector(
  selectMainPerson,
  selectMainPersonLines,
  (state: IStoreState) => state.DatabaseReducer.userData,
  (mainPerson: IUser | undefined, connections: ILines, userData: IUserMap | undefined) => {
    if (mainPerson === undefined || mainPerson.connections === undefined || userData === undefined) {
      return connections;
    }

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
  (state: IStoreState) => state.DatabaseReducer.userData,
  (mainPerson: IUser | undefined, users: IUserMap | undefined): ILocation => {
    if (mainPerson === undefined || users === undefined || mainPerson.connections === undefined) {
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
      .sort((a: string, b: string) => users[a].name.localeCompare(users[b].name))
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
  (mainPerson: IUser | undefined, connections: ILines, locations: ILocation): IPeopleGraph | undefined => {
    if (mainPerson === undefined || mainPerson.connections === undefined) {
      return undefined;
    }
    const dimension = -Object.keys(mainPerson.connections).length / 2.25 + 19;
    return { mainPerson, connections, dimension, locations };
  }
);

export const selectSortedEvents = createSelector(
  (state: IStoreState) => state.DatabaseReducer.eventData,
  (eventData: IEventMap | undefined) => {
    if (eventData === undefined) {
      return [];
    }
    return Object.values(eventData).sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
);
