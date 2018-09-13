import { setWith, TypedReducer } from "redoodle";

import { convertArrayToObject, convertPayloadToUser } from "../Utils/Util";
import { EmptyDatabaseCache, ForceUpdate, Login, UpdateGraph, UpdateUser, UpdateUserData } from "./DatabaseActions";
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
    .withHandler(UpdateUser.TYPE, (state, payload) => {
        return setWith(state, {
            currentUser: payload,
            forceUpdate: undefined,
        });
    })
    .withHandler(UpdateGraph.TYPE, (state, payload) => {
        return setWith(state, {
            eventData: convertArrayToObject(payload.events),
            userData: convertArrayToObject(payload.users),
        });
    })
    .withHandler(UpdateUserData.TYPE, (state, payload) => {
        return setWith(state, {
            userData: { ...state.userData, [payload.id]: payload },
        });
    })
    .withHandler(EmptyDatabaseCache.TYPE, () => {
        return EMPTY_STATE.DatabaseReducer;
    })
    .build();
