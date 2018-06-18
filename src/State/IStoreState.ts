import Event from '../Helpers/Event';
import User from '../Helpers/User';

export default interface IStoreState {
    GoogleReducer: {
        isFetching: boolean;
        userData?: { id?: User };
        eventData?: { id?: Event };
        googleSheetDataError?: object;
        isSignedIn: boolean;
    }
    WebsiteReducer: {
        infoPerson?: User;
        mainPerson?: User;
        party?: string[];
    }
}