import IStoreState, { EMPTY_STATE } from "./IStoreState";

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
    // TODO: Handle error
  }
};

export const saveState = (state: IStoreState) => {
  try {
    const substate = (({
      currentUser,
      isFetching,
      isLoggedIn,
      forceUpdate
    }) => ({
      currentUser,
      forceUpdate,
      isFetching,
      isLoggedIn
    }))(state.DatabaseReducer);
    const serializedState = JSON.stringify(substate);
    localStorage.setItem("state", serializedState);
  } catch (error) {
    // TODO: Handle error
  }
};

export const saveToken = (token: string) => {
  try {
    document.cookie = `a_t=${token}`;
  } catch (error) {
    // TODO: Handle error
  }
};

export const retrieveToken = () => {
  try {
    const cookie = document.cookie.match("a_t=.*(;?)");
    if (cookie == null) {
      return null;
    }
    return cookie[0].split("=")[1];
  } catch (error) {
    return "";
  }
};
