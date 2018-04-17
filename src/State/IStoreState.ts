import Event from '../Helpers/Event';
import User from '../Helpers/User';

export default interface IStoreState {
    fetching: boolean;
    userData?: { id: User },
    eventData?: { id: Event },
    googleSheetDataError?: any,
    isSignedIn?: boolean,
}