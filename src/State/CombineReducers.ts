import { combineReducers } from "redux";
import IStoreState from "./IStoreState";
import reducer from "./Reducer";

const rootReducer = combineReducers<IStoreState>({
    reducer,
});

export default rootReducer;