import { setWith, TypedReducer } from "redoodle";

import User from "../Utils/User";
import { EmptyDatabaseCache, ForceUpdate, Login, UpdateUser } from "./DatabaseActions";
import IStoreState from "./IStoreState";
import { EMPTY_STATE } from "./StoreCache";

export const DatabaseReducer = TypedReducer.builder<IStoreState["DatabaseReducer"]>()
    .withHandler(Login.TYPE, (state, payload) => {
        return setWith(state, {
            currentUser: new User(payload._id, payload.name, payload.gender, payload.age, payload.location, payload.phoneNumber, [], [], [], payload.connections),
            isLoggedIn: true,
        })
    })
    .withHandler(ForceUpdate.TYPE, (state, payload) => {
        return setWith(state, {
            forceUpdate: payload,
        })
    })
    .withHandler(EmptyDatabaseCache.TYPE, () => {
        return EMPTY_STATE.DatabaseReducer;
    })
    .withHandler(UpdateUser.TYPE, (state, payload) => {
        return setWith(state, {
            currentUser: payload,
            forceUpdate: undefined,
        })
    })
    .build();
