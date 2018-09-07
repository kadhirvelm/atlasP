import Event from "../Helpers/Event";
import User, { IUser } from "../Helpers/User";

export interface IUserMap {
    id?: User;
}

export interface IEventMap {
    id?: Event;
}

export default interface IStoreState {
    DatabaseReducer: {
        currentUser?: IUser;
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
        infoPerson?: User;
        graphRef: HTMLElement | null;
        mainPerson?: User;
        party?: string[];
    };
}
