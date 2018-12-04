import { setWith, TypedReducer } from "redoodle";

import { IUser } from "../Types/Users";
import {
  addToMap,
  convertArrayToMap,
  convertPayloadToUser
} from "../Utils/Util";
import {
  ClearForceUpdate,
  DeleteEvent,
  DeleteUser,
  EmptyDatabaseCache,
  ForceUpdate,
  Login,
  SetPremiumStatus,
  UpdateEventData,
  UpdateFrequency,
  UpdateGraph,
  UpdateOtherUser,
  UpdateUser,
  UpdateUserData
} from "./DatabaseActions";
import IStoreState, { EMPTY_STATE } from "./IStoreState";

export const DatabaseReducer = TypedReducer.builder<
  IStoreState["DatabaseReducer"]
>()
  .withHandler(Login.TYPE, (state, payload) => {
    return setWith(state, {
      currentUser: convertPayloadToUser(payload),
      isLoggedIn: true
    });
  })
  .withHandler(ForceUpdate.TYPE, (state, payload) => {
    return setWith(state, {
      forceUpdate: payload
    });
  })
  .withHandler(ClearForceUpdate.TYPE, state => {
    return setWith(state, {
      forceUpdate: undefined
    });
  })
  .withHandler(DeleteEvent.TYPE, (state, payload) => {
    if (state.eventData === undefined) {
      return state;
    }
    const eventData = new Map(state.eventData);
    eventData.delete(payload);
    return setWith(state, {
      eventData
    });
  })
  .withHandler(DeleteUser.TYPE, (state, payload) => {
    if (state.userData === undefined) {
      return state;
    }
    const userData = new Map(state.userData);
    userData.delete(payload);
    return setWith(state, {
      userData
    });
  })
  .withHandler(UpdateUser.TYPE, (state, payload) => {
    const { currentUser } = state;
    if (currentUser === undefined) {
      return state;
    }

    return setWith(state, {
      currentUser: { ...currentUser, ...payload }
    });
  })
  .withHandler(UpdateFrequency.TYPE, (state, payload) => {
    const { currentUser } = state;
    if (currentUser === undefined) {
      return state;
    }

    return setWith(state, {
      currentUser: {
        ...currentUser,
        frequency: {
          ...currentUser.frequency,
          ...payload
        }
      }
    });
  })
  .withHandler(UpdateOtherUser.TYPE, (state, payload) => {
    const { userData } = state;
    if (userData === undefined) {
      return state;
    }

    const newUserDataMap = new Map(userData);
    const currentDetails = newUserDataMap.get(payload.userId);
    if (currentDetails === undefined) {
      return state;
    }

    const newDetails: IUser = { ...currentDetails, ...payload.newUserDetails };
    newUserDataMap.set(payload.userId, newDetails);
    return setWith(state, {
      userData: newUserDataMap
    });
  })
  .withHandler(UpdateGraph.TYPE, (state, payload) => {
    return setWith(state, {
      eventData: convertArrayToMap(payload.events),
      userData: convertArrayToMap(payload.users)
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
      userData: addToMap(userData, payload)
    });
  })
  .withHandler(UpdateEventData.TYPE, (state, payload) => {
    const { currentUser, eventData } = state;
    if (eventData === undefined || currentUser === undefined) {
      return state;
    }

    const { connections } = currentUser;
    if (connections === undefined) {
      return state;
    }

    payload.attendees.forEach(user => {
      if (!connections[user.id].includes(payload.id)) {
        connections[user.id].push(payload.id);
      }
    });

    return setWith(state, {
      currentUser,
      eventData: addToMap(eventData, payload)
    });
  })
  .withHandler(SetPremiumStatus.TYPE, (state, payload) => {
    return setWith(state, {
      isPremium: payload
    });
  })
  .withHandler(EmptyDatabaseCache.TYPE, () => {
    return EMPTY_STATE.DatabaseReducer;
  })
  .build();
