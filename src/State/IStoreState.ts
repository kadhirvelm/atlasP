import { IEvent, IEventMap } from "../Types/Events";
import { IFilter } from "../Types/Graph";
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
        selectedEvent: IEvent | undefined;
    };
}
