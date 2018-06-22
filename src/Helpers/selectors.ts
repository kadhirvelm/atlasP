import { createSelector } from "reselect"
import IStoreState, { IUserMap } from '../State/IStoreState';
import User from './User';

const MAX_RADIANS = 2 * Math.PI;
const RADIUS = 42;
const X_ORIGIN = 50;
const Y_ORIGIN = 50;

export interface ILines {
    id?: {
        fromHost?: boolean,
        toHost?: boolean,
    }
}

export interface IConnectionLines {
    redLines: ILines,
    greenLines: ILines,
}

export interface ILocation {
    id?: {
        x?: number,
        y?: number
    }
}

export interface IPeopleGraph {
    mainPerson: User,
    connections: IConnectionLines,
    locations: ILocation,
}

const selectMainPerson = (state: IStoreState) => state.WebsiteReducer.mainPerson

export const selectMainPersonLines = createSelector(
    selectMainPerson,
    (mainPerson: User): IConnectionLines => {
        const redLines = {}
        const greenLines = {}
        mainPerson.redList.map((singlePerson) => redLines[singlePerson] = { fromHost: true })
        mainPerson.greenList.map((singlePerson) => greenLines[singlePerson] = { fromHost: true })
        return { redLines, greenLines }
    }
)

export const selectMainPersonConnectionLines = createSelector(
    selectMainPerson,
    selectMainPersonLines,
    (state: IStoreState) => state.GoogleReducer.userData,
    (mainPerson: User, connections: IConnectionLines, userData: IUserMap) => {
        Object.keys(mainPerson.connections).map((userID: string) => {
            const user = userData[userID];
            if(user.redList && user.redList.includes(mainPerson.id)){ connections[user.id] = Object.assign({}, connections[user.id], { toHost: true }) }
            if(user.greenList && user.greenList.includes(mainPerson.id)){ connections[user.id] = Object.assign({}, connections[user.id], { toHost: true }) }
        })
        return connections
    }
)

export const selectConnectionLocations = createSelector(
    selectMainPerson,
    (mainPerson: User): ILocation => {
        const locations = {};
        const totalConnections = Object.keys(mainPerson.connections).length;

        const returnPositionOnCircle = (origin: number, mathFunction: (position: number) => number, index: number) => {
            return origin + (mathFunction(MAX_RADIANS / totalConnections * index) * RADIUS)
        }

        Object.keys(mainPerson.connections).map((userID: string, index: number) => {
            locations[userID] = { x: returnPositionOnCircle(X_ORIGIN, Math.cos, index), y: returnPositionOnCircle(Y_ORIGIN, Math.sin, index) }
        })
        return locations;
    }
)

export const selectMainPersonGraph = createSelector(
    selectMainPerson,
    selectMainPersonConnectionLines,
    selectConnectionLocations,
    (mainPerson: User, connections: IConnectionLines, locations: ILocation): IPeopleGraph => {
        return { mainPerson, connections, locations }
    }
)
