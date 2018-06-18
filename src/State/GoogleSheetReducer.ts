import { TypedReducer, setWith } from "redoodle";

import {
  ChangeSignIn,
  FailedDataFetch,
  StartingDataFetch,
  SuccessfulDataFetch,
} from "./GoogleSheetActions";
import IStoreState from './IStoreState';
import { assembleObjects } from '../Helpers/Assembler';

export const GoogleReducer = TypedReducer.builder<IStoreState["GoogleReducer"]>()
  .withHandler(StartingDataFetch.TYPE, (state, _payload) => {
    return setWith(state, {
      isFetching: true,
    });
  })
  .withHandler(SuccessfulDataFetch.TYPE, (state, payload) => {
    const assembledObject = assembleObjects(payload.userData, payload.eventData);
    return setWith(state, {
      isFetching: false,
      isSignedIn: state.isSignedIn,
      userData: assembledObject.userData,
      eventData: assembledObject.eventData,
    })
  })
  .withHandler(FailedDataFetch.TYPE, (state, payload) => {
    return setWith(state, {
      googleSheetDataError: payload,
    });
  })
  .withHandler(ChangeSignIn.TYPE, (state, payload) => {
    return setWith(state, {
      isSignedIn: payload,
    });
  })
  .build();
  