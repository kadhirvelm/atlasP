import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './CombineReducers';
import IStoreState from './IStoreState';

export default function configureStore(savedState: IStoreState) {
  return createStore<IStoreState>(
    rootReducer,
    savedState,
    applyMiddleware(thunkMiddleware)
  );
}