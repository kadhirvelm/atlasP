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
            window['gapi'].client.sheets.spreadsheets.values.get({
              range: 'Users-Data!A1:O35',
              spreadsheetId: '1subd2wYnMRN4lSg6XeJKIIBlX6_38ygWZcHNl8C-UWc'
            }).then((response: string[]) => {
                console.log(response)
                dispatch(succesfullyFetchedData(response));
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
    readonly googleSheetData: any[],
    readonly type: ActionTypes.Success_FetchGoogleSheetData,
}

function succesfullyFetchedData(returnedData: any[]): IActionsSuccess {
    return {
        googleSheetData: returnedData,
        type: ActionTypes.Success_FetchGoogleSheetData,
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