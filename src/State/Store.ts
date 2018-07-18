import { createStore, loggingMiddleware, StoreEnhancer } from "redoodle";
import { applyMiddleware, Store } from "redux";

import { RootReducer } from "./CombineReducers";
import IStoreState from "./IStoreState";

export default function configureStore(savedState: IStoreState): Store<IStoreState> {
  const logging = applyMiddleware(loggingMiddleware()) as StoreEnhancer;
  const initialState: IStoreState = {
    GoogleReducer: {
      isFetching: false,
      isSignedIn: false,
    },
    WebsiteReducer: {
      graphRef: null,
    }, ...savedState};

  return createStore(RootReducer, initialState, logging);
}
