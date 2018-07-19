import Event from "../Helpers/Event";
import User from "../Helpers/User";

export interface IUserMap {
    id?: User;
}

export interface IEventMap {
    id?: Event;
}

export default interface IStoreState {
    GoogleReducer: {
        eventData?: IEventMap;
        googleSheetDataError?: object;
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
