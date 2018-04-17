import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import IStoreState from "./IStoreState";
import reducer from "./Reducer";

export default function configureStore(savedState: IStoreState) {
  return createStore<IStoreState>(
    reducer,
    savedState,
    applyMiddleware(thunkMiddleware)
  );
}