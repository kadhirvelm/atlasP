import { IEventMap } from "../Types/Events";
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
        graphRef: HTMLElement | null;
        party?: string[];
    };
}
