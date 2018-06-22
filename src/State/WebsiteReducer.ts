import { TypedReducer, setWith } from "redoodle";

import IStoreState from './IStoreState';
import { ChangeParty, SetMainPerson, SetInfoPerson, SetGraphRef } from './WebsiteActions';
import { SuccessfulDataFetch } from './GoogleSheetActions';

export const WebsiteReducer = TypedReducer.builder<IStoreState["WebsiteReducer"]>()
  .withHandler(SuccessfulDataFetch.TYPE, (state, _payload) => {
    return setWith(state, {
      infoPerson: undefined,
      mainPerson: undefined,
    });
  })
  .withHandler(SetMainPerson.TYPE, (state, payload) => {
    return setWith(state, {
      mainPerson: payload,
    });
  })
  .withHandler(SetInfoPerson.TYPE, (state, payload) => {
    return setWith(state, {
      infoPerson: payload,
    });
  })
  .withHandler(ChangeParty.TYPE, (state, payload) => {
    return setWith(state, {
      party: payload,
    });
  })
  .withHandler(SetGraphRef.TYPE, (state, payload) => {
    return setWith(state, {
      graphRef: payload,
    })
  })
  .build();
