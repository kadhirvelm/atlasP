import IStoreState from "./IStoreState";

export const EMPTY_STATE: IStoreState = {
  GoogleReducer: {
    isFetching: false,
    isSignedIn: false,
  },
  WebsiteReducer: {
    graphRef: null,
  }
}

export const loadState = (): IStoreState => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return EMPTY_STATE;
    }
    return { ...EMPTY_STATE, GoogleReducer: JSON.parse(serializedState) }
  } catch (err) {
    return EMPTY_STATE;
  }
};

export const saveState = (state: IStoreState) => {
  try {
    const serializedState = JSON.stringify(state.GoogleReducer);
    localStorage.setItem("state", serializedState);
  } catch (error) {
    console.error(error);
  }
};
