import { setWith, TypedReducer } from "redoodle";

import { SuccessfulDataFetch } from "./GoogleSheetActions";
import IStoreState from "./IStoreState";
import { ChangeParty, SetGraphRef, SetInfoPerson, SetMainPerson } from "./WebsiteActions";

export const WebsiteReducer = TypedReducer.builder<IStoreState["WebsiteReducer"]>()
  // tslint:disable-next-line:variable-name
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
    });
  })
  .build();
