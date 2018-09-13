import { combineReducers } from "redoodle";

import { DatabaseReducer } from "./DatabaseReducer";
import IStoreState from "./IStoreState";
import { WebsiteReducer } from "./WebsiteReducer";

export const RootReducer = combineReducers<IStoreState>({
  DatabaseReducer,
  WebsiteReducer
});
