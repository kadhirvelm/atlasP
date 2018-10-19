import { setWith, TypedReducer } from "redoodle";

import { convertArrayToObject, convertPayloadToUser } from "../Utils/Util";
import { ClearForceUpdate, EmptyDatabaseCache, ForceUpdate, Login, UpdateEventData, UpdateGraph, UpdateUser, UpdateUserData } from "./DatabaseActions";
import IStoreState from "./IStoreState";
import { EMPTY_STATE } from "./StoreCache";

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
            eventData: convertArrayToObject(payload.events),
            userData: convertArrayToObject(payload.users),
        });
    })
    .withHandler(UpdateUserData.TYPE, (state, payload) => {
        const currentUser = state.currentUser;
        if (currentUser !== undefined && currentUser.connections !== undefined) {
            currentUser.connections[payload.id] = [];
        }
        return setWith(state, {
            currentUser,
            userData: { ...state.userData, [payload.id]: payload },
        });
    })
    .withHandler(UpdateEventData.TYPE, (state, payload) => {
        const currentUser = state.currentUser;
        if (currentUser !== undefined && currentUser.connections !== undefined) {
            payload.attendees.forEach((user) => (currentUser.connections as any)[user.id].push(payload.id));
        }
        return setWith(state, {
            currentUser,
            eventData: { ...state.eventData, [payload.id]: payload },
        });
    })
    .withHandler(EmptyDatabaseCache.TYPE, () => {
        return EMPTY_STATE.DatabaseReducer;
    })
    .build();
