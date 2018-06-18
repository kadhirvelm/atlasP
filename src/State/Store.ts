import { createStore, loggingMiddleware, StoreEnhancer } from "redoodle";
import { Store, applyMiddleware } from "redux";

import { RootReducer } from "./CombineReducers";
import IStoreState from "./IStoreState";

export default function configureStore(savedState: IStoreState): Store<IStoreState> {
  const logging = applyMiddleware(loggingMiddleware()) as StoreEnhancer;
  const initialState: IStoreState = Object.assign({}, {
    GoogleReducer: {
      isFetching: false,
      isSignedIn: false,
    },
    WebsiteReducer: {}
  }, savedState);

  return createStore(RootReducer, initialState, logging);
}
