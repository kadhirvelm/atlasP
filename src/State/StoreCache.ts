import IStoreState from "./IStoreState";

export const EMPTY_STATE: IStoreState = {
  DatabaseReducer: {
    isFetching: false,
    isLoggedIn: false
  },
  WebsiteReducer: {
    graphRef: null
  }
};

export const loadState = (): IStoreState => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return EMPTY_STATE;
    }
    return { ...EMPTY_STATE, DatabaseReducer: JSON.parse(serializedState) };
  } catch (err) {
    return EMPTY_STATE;
  }
};

export const emptyCache = () => {
  try {
    const emptyState = JSON.stringify(EMPTY_STATE.DatabaseReducer);
    localStorage.setItem("state", emptyState);
  } catch (error) {
    console.error(error);
  }
};

export const saveState = (state: IStoreState) => {
  try {
    const serializedState = JSON.stringify(state.DatabaseReducer);
    localStorage.setItem("state", serializedState);
  } catch (error) {
    console.error(error);
  }
};

export const saveToken = (token: string) => {
  try {
    localStorage.setItem("token", token);
  } catch (error) {
    console.error(error);
  }
};

export const retrieveToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    return "";
  }
};
