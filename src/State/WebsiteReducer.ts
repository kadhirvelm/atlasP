import { TypedReducer, setWith } from "redoodle";

import IStoreState from './IStoreState';
import { SetMainPerson, SetInfoPerson, ChangeParty } from './WebsiteActions';
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
  .build();
