import { combineReducers } from 'redux';
import GoogleReducer from './GoogleSheetReducer';
import IStoreState from './IStoreState';
import WebsiteReducer from './WebsiteReducer';

const rootReducer = combineReducers<IStoreState>({
    GoogleReducer,
    WebsiteReducer,
});

export default rootReducer;