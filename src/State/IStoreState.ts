export default interface IStoreState {
    fetching: boolean;
    userData?: string[][],
    eventData?: string[][],
    googleSheetDataError?: any,
    isSignedIn?: boolean,
}