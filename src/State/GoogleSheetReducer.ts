import { setWith, TypedReducer } from "redoodle";

import { assembleObjects } from "../Helpers/Assembler";
import {
  ChangeSignIn,
  FailedDataFetch,
  StartingDataFetch,
  SuccessfulDataFetch,
} from "./GoogleSheetActions";
import IStoreState from "./IStoreState";

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
      isSignedIn: payload,
    });
  })
  .build();
