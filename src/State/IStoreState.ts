import { IForceUpdate, IUser, IUserMap } from "../Types/Users";
import Event from "../Utils/Event";

export interface IEventMap {
    id?: Event;
}

export default interface IStoreState {
    DatabaseReducer: {
        currentUser?: IUser;
        forceUpdate?: IForceUpdate;
        isFetching: boolean;
        isLoggedIn: boolean;
    };
    GoogleReducer: {
        currentUser?: any;
        eventData?: IEventMap;
        googleSheetDataError?: object;
        isAdmin?: boolean;
        isFetching: boolean;
        isSignedIn: boolean;
        rawData?: any;
        userData?: IUserMap;
    };
    WebsiteReducer: {
        infoPerson?: IUser;
        graphRef: HTMLElement | null;
        mainPerson?: IUser;
        party?: string[];
    };
}
