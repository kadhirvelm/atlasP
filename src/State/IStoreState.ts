import Event from '../Helpers/Event';
import User from '../Helpers/User';

export interface IUserMap {
    id?: User,
}

export interface IEventMap {
    id?: Event,
}

export default interface IStoreState {
    GoogleReducer: {
        isFetching: boolean;
        userData?: IUserMap;
        eventData?: IEventMap;
        googleSheetDataError?: object;
        isSignedIn: boolean;
    }
    WebsiteReducer: {
        infoPerson?: User;
        graphRef: HTMLElement | null;
        mainPerson?: User;
        party?: string[];
    }
}