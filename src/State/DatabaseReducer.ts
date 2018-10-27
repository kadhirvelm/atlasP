import { setWith, TypedReducer } from "redoodle";

import { addToMap, convertArrayToMap, convertPayloadToUser } from "../Utils/Util";
import { ClearForceUpdate, EmptyDatabaseCache, ForceUpdate, Login, UpdateEventData, UpdateGraph, UpdateUser, UpdateUserData } from "./DatabaseActions";
import IStoreState, { EMPTY_STATE } from "./IStoreState";

export const DatabaseReducer = TypedReducer.builder<IStoreState["DatabaseReducer"]>()
    .withHandler(Login.TYPE, (state, payload) => {
        return setWith(state, {
            currentUser: convertPayloadToUser(payload),
            isLoggedIn: true,
        });
    })
    .withHandler(ForceUpdate.TYPE, (state, payload) => {
        return setWith(state, {
            forceUpdate: payload,
        });
    })
    .withHandler(ClearForceUpdate.TYPE, (state) => {
        return setWith(state, {
            forceUpdate: undefined,
        });
    })
    .withHandler(UpdateUser.TYPE, (state, payload) => {
        return setWith(state, {
            currentUser: payload,
        });
    })
    .withHandler(UpdateGraph.TYPE, (state, payload) => {
        return setWith(state, {
            eventData: convertArrayToMap(payload.events),
            userData: convertArrayToMap(payload.users),
        });
    })
    .withHandler(UpdateUserData.TYPE, (state, payload) => {
        const { currentUser, userData } = state;
        if (userData === undefined) {
            return state;
        }

        if (currentUser !== undefined && currentUser.connections !== undefined) {
            currentUser.connections[payload.id] = [];
        }

        return setWith(state, {
            currentUser,
            userData: addToMap(userData, payload),
        });
    })
    .withHandler(UpdateEventData.TYPE, (state, payload) => {
        const { currentUser, eventData } = state;
        if (eventData === undefined) {
            return state;
        }

        if (currentUser !== undefined && currentUser.connections !== undefined) {
            payload.attendees.forEach((user) => (currentUser.connections as any)[user.id].push(payload.id));
        }

        return setWith(state, {
            currentUser,
            eventData: addToMap(eventData, payload),
        });
    })
    .withHandler(EmptyDatabaseCache.TYPE, () => {
        return EMPTY_STATE.DatabaseReducer;
    })
    .build();
