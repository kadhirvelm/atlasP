export default interface IStoreState {
    fetching: boolean;
    googleSheetData?: any[],
    googleSheetDataError?: any,
    isSignedIn?: boolean,
}