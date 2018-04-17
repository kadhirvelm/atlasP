export default interface IStoreState {
    fetching: boolean;
    userData?: string[][],
    googleSheetDataError?: any,
    isSignedIn?: boolean,
}