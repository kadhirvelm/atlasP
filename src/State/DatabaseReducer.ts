import { setWith, TypedReducer } from "redoodle";

import User from "../Helpers/User";
import { EmptyDatabaseCache, Login } from "./DatabaseActions";
import IStoreState from "./IStoreState";
import { EMPTY_STATE } from "./StoreCache";

export const DatabaseReducer = TypedReducer.builder<IStoreState["DatabaseReducer"]>()
    .withHandler(Login.TYPE, (state, payload) => {
        return setWith(state, {
            currentUser: new User(payload._id, payload.name, payload.gender, payload.age, payload.location, payload.phoneNumber, [], [], []),
            isLoggedIn: true,
        })
    })
    .withHandler(EmptyDatabaseCache.TYPE, () => {
        return EMPTY_STATE.DatabaseReducer;
    })
    .build();
