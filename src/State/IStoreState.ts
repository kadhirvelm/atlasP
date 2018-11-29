import { IGraphUser } from "../Components/DisplayGraph/DisplayGraph";
import { DRIFT_GRAPH } from "../Components/Navbar/NavbarComponents/GraphType/GraphConstants";
import { IEvent } from "../Types/Events";
import { IFilter, IGraphType } from "../Types/Graph";
import { IForceUpdate } from "../Types/Other";
import { IUser } from "../Types/Users";

export default interface IStoreState {
  DatabaseReducer: {
    currentUser?: IUser;
    eventData?: Map<string, IEvent>;
    forceUpdate?: IForceUpdate;
    isFetching: boolean;
    isLoggedIn: boolean;
    isPremium: boolean;
    userData?: Map<string, IUser>;
  };
  WebsiteReducer: {
    contextMenuNode: IGraphUser | undefined;
    displayRecommendation: IUser | undefined;
    infoPerson?: IUser;
    graphFilters: IFilter[];
    graphRef: HTMLElement | null;
    graphType: IGraphType;
    highlightConnections: Set<string>;
    selectedEvent: IEvent | undefined;
  };
}

export const EMPTY_STATE: IStoreState = {
  DatabaseReducer: {
    isFetching: false,
    isLoggedIn: false,
    isPremium: false
  },
  WebsiteReducer: {
    contextMenuNode: undefined,
    displayRecommendation: undefined,
    graphFilters: [],
    graphRef: null,
    graphType: DRIFT_GRAPH,
    highlightConnections: new Set(),
    selectedEvent: undefined
  }
};
