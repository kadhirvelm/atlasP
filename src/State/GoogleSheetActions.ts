import { TypedAction } from "redoodle";

export const StartingDataFetch = TypedAction.defineWithoutPayload(
  "GoogleSheetActions//START_DATA_FETCH"
)();

export const SuccessfulDataFetch = TypedAction.define("GoogleSheetActions//SUCCESSFUL_DATA_FETCH")<{
  eventData: string[][],
  rawData: any,
  userData: string[][]
}>();

export const FailedDataFetch = TypedAction.define("GoogleSheetActions//FAILED_DATA_FETCH")<any>();

export const ChangeSignIn = TypedAction.define("GoogleSheetsAction//CHANGE_SIGN_IN")<{
  isSignedIn: boolean,
  currentUser: any,
  isAdmin: boolean
}>();

export const EmptyGoogleCache = TypedAction.defineWithoutPayload(
  "WebsiteReducer//EMPTY__GOOGLE_CACHE"
)();
