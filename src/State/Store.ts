import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import IStoreState from "./IStoreState";
import rootReducer from "./Reducer";

export default function configureStore() {
  return createStore<IStoreState>(
    rootReducer,
    applyMiddleware(thunkMiddleware)
  );
}