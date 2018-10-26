import { IGraphUser } from "../Components/DisplayGraph/DisplayGraph";
import { DRIFT_GRAPH } from "../Components/Navbar/NavbarComponents/GraphType/GraphConstants";
import { IEvent, IEventMap } from "../Types/Events";
import { IFilter, IGraphType } from "../Types/Graph";
import { IForceUpdate } from "../Types/Other";
import { IUser, IUserMap } from "../Types/Users";

export default interface IStoreState {
    DatabaseReducer: {
        currentUser?: IUser;
        eventData?: IEventMap;
        forceUpdate?: IForceUpdate;
        isFetching: boolean;
        isLoggedIn: boolean;
        userData?: IUserMap;
    };
    WebsiteReducer: {
        contextMenuNode: IGraphUser | undefined;
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
      isLoggedIn: false
    },
    WebsiteReducer: {
      contextMenuNode: undefined,
      graphFilters: [],
      graphRef: null,
      graphType: DRIFT_GRAPH,
      highlightConnections: new Set,
      selectedEvent: undefined,
    }
  };
  