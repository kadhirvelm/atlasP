import { setWith, TypedReducer } from "redoodle";

import { assembleObjects } from "../Helpers/Assembler";
import {
  ChangeSignIn,
  EmptyGoogleCache,
  FailedDataFetch,
  StartingDataFetch,
  SuccessfulDataFetch,
} from "./GoogleSheetActions";
import IStoreState from "./IStoreState";
import { EMPTY_STATE, emptyCache } from "./StoreCache";

export const GoogleReducer = TypedReducer.builder<IStoreState["GoogleReducer"]>()
  // tslint:disable-next-line:variable-name
  .withHandler(StartingDataFetch.TYPE, (state, _payload) => {
    return setWith(state, {
      isFetching: true,
    });
  })
  .withHandler(SuccessfulDataFetch.TYPE, (state, payload) => {
    const assembledObject = assembleObjects(payload.userData, payload.eventData);
    return setWith(state, {
      eventData: assembledObject.eventData,
      isFetching: false,
      isSignedIn: state.isSignedIn,
      rawData: payload.rawData,
      userData: assembledObject.userData,
    });
  })
  .withHandler(FailedDataFetch.TYPE, (state, payload) => {
    return setWith(state, {
      googleSheetDataError: payload,
      isFetching: false,
    });
  })
  .withHandler(ChangeSignIn.TYPE, (state, payload) => {
    return setWith(state, {
      currentUser: payload.currentUser,
      isAdmin: payload.isAdmin,
      isSignedIn: payload.isSignedIn,
    });
  })
  // tslint:disable-next-line:variable-name
  .withHandler(EmptyGoogleCache.TYPE, (_state, _payload) => {
    emptyCache();
    return EMPTY_STATE.GoogleReducer;
  })
  .build();
