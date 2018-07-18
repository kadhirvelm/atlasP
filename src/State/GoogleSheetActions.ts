import { TypedAction } from "redoodle";

export const StartingDataFetch = TypedAction.defineWithoutPayload(
  "GoogleSheetActions//START_DATA_FETCH",
)();

export const SuccessfulDataFetch = TypedAction.define("GoogleSheetActions//SUCCESSFUL_DATA_FETCH")<{
  eventData: string[][],
  userData: string[][],
}>();

export const FailedDataFetch = TypedAction.define("GoogleSheetActions//FAILED_DATA_FETCH")<any>();

export const ChangeSignIn = TypedAction.define("GoogleSheetsAction//CHANGE_SIGN_IN")<boolean>();
