import { TypedAction } from "redoodle";
import { Dispatch } from "redux";

export function fetchGoogleSheetData(dispatch: Dispatch) {
  return () => {
    dispatch(StartingDataFetch.create());
    window["gapi"].client.load("sheets", "v4", () => {
      window["gapi"].client.sheets.spreadsheets.values
        .batchGet({
          ranges: ["Users-Data!A1:Z35", "Events-Data!A1:D100"],
          spreadsheetId: process.env.REACT_APP_SPREADSHEET
        })
        .then((response: object) => {
          const results = response["result"].valueRanges;
          dispatch(
            SuccessfulDataFetch.create({
              userData: results[0].values,
              eventData: results[1].values
            })
          );
        })
        .catch((error: any) => {
          dispatch(FailedDataFetch.create(error));
        });
    });
  };
}

export const StartingDataFetch = TypedAction.defineWithoutPayload(
  "GoogleSheetActions//START_DATA_FETCH"
)();

export const SuccessfulDataFetch = TypedAction.define("GoogleSheetActions//SUCCESSFUL_DATA_FETCH")<{
  eventData: string[][],
  userData: string[][]
}>();

export const FailedDataFetch = TypedAction.define("GoogleSheetActions//FAILED_DATA_FETCH")<any>();

export const ChangeSignIn = TypedAction.define("GoogleSheetsAction//CHANGE_SIGN_IN")<boolean>();
