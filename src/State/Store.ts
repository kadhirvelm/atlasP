import { createStore, loggingMiddleware, reduceCompoundActions, StoreEnhancer } from "redoodle";
import { applyMiddleware, Store } from "redux";

import { RootReducer } from "./CombineReducers";
import IStoreState, { EMPTY_STATE } from "./IStoreState";

export default function configureStore(savedState: IStoreState): Store<IStoreState> {
  const logging = applyMiddleware(loggingMiddleware()) as StoreEnhancer;
  const initialState: IStoreState = { ...EMPTY_STATE, ...savedState};

  return createStore(reduceCompoundActions(RootReducer), initialState, logging);
}
