import { combineReducers } from "redoodle";

import { GoogleReducer } from "./GoogleSheetReducer";
import IStoreState from "./IStoreState";
import { WebsiteReducer } from "./WebsiteReducer";

export const RootReducer = combineReducers<IStoreState>({
  GoogleReducer,
  WebsiteReducer
});
