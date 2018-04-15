import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import IStoreState from "./IStoreState";
import reducer from "./Reducer";

export default function configureStore() {
  return createStore<IStoreState>(
    reducer,
    applyMiddleware(thunkMiddleware)
  );
}