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
        infoPerson?: IUser;
        graphFilters: IFilter[];
        graphRef: HTMLElement | null;
        graphType: IGraphType;
        selectedEvent: IEvent | undefined;
    };
}

export const EMPTY_STATE: IStoreState = {
    DatabaseReducer: {
      isFetching: false,
      isLoggedIn: false
    },
    WebsiteReducer: {
      graphFilters: [],
      graphRef: null,
      graphType: DRIFT_GRAPH,
      selectedEvent: undefined,
    }
  };