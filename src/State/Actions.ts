import { Dispatch } from 'redux';
import IStoreState from './IStoreState';

export enum ActionTypes {
    Change_Sign_In = 'Change_Sign_In',
    Progress_FetchGoogleSheetData = 'PROGRESS_FetchGoogleSheetData',
    Success_FetchGoogleSheetData = 'SUCCESS_FetchGoogleSheetData',
    Failure_FetchGoogleSheetData = 'FAILURE_FetchGoogleSheetData',
}

export function fetchGoogleSheetData(googleApi: any): (dispatch: Dispatch<IStoreState>) => void {
    return (dispatch: Dispatch<IStoreState>) => {
        dispatch(startingFetchedData());
        window['gapi'].client.load('sheets', 'v4', () => {
            window['gapi'].client.sheets.spreadsheets.values.batchGet({
              ranges: ['Users-Data!A1:O35', 'Events-Data!A1:C100'],
              spreadsheetId: '1subd2wYnMRN4lSg6XeJKIIBlX6_38ygWZcHNl8C-UWc'
            }).then((response: object) => {
                const results = response['result'].valueRanges;
                dispatch(succesfullyFetchedData(results[0].values, results[1].values));
            }).catch((error: any) => {
                dispatch(failedFetchedData(error));
            });
        });
    };
}

interface IActionsProgress {
  readonly type: ActionTypes.Progress_FetchGoogleSheetData,
}

function startingFetchedData(): IActionsProgress {
  return {
      type: ActionTypes.Progress_FetchGoogleSheetData,
  }
}

interface IActionsSuccess {
    readonly userData: string[][],
    readonly eventData: string[][],
    readonly type: ActionTypes.Success_FetchGoogleSheetData,
}

function succesfullyFetchedData(userData: string[][], eventData: string[][]): IActionsSuccess {
    return {
        eventData,
        type: ActionTypes.Success_FetchGoogleSheetData,
        userData,
    }
}

interface IActionsFailure {
  readonly googleSheetDataError: any,
  readonly type: ActionTypes.Failure_FetchGoogleSheetData,
}

function failedFetchedData(error: any): IActionsFailure {
  return {
      googleSheetDataError: error,
      type: ActionTypes.Failure_FetchGoogleSheetData,
  }
}

export function changeSignInStatus(isSignedIn: boolean): (dispatch: Dispatch<IStoreState>) => void {
  return (dispatch: Dispatch<IStoreState>) => {
    dispatch(changeSignIn(isSignedIn));
  }
}

interface IChangeSignIn {
  isSignedIn: boolean,
  type: ActionTypes.Change_Sign_In,
}

function changeSignIn(isSignedIn: boolean): IChangeSignIn {
  return {
    isSignedIn,
    type: ActionTypes.Change_Sign_In,
  }
}