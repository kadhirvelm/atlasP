import { Dispatch } from 'redux';
import IStoreState from './IStoreState';

export enum ActionTypes {
    Progress_FetchGoogleSheetData = 'PROGRESS_FetchGoogleSheetData',
    Success_FetchGoogleSheetData = 'SUCCESS_FetchGoogleSheetData',
    Failure_FetchGoogleSheetData = 'FAILURE_FetchGoogleSheetData',
}

export function fetchGoogleSheetData(): (dispatch: Dispatch<IStoreState>) => void {
    return (dispatch: Dispatch<IStoreState>) => {
        dispatch(startingFetchedData());
        dispatch(succesfullyFetchedData());
    };
}

interface IActionsProgress {
  readonly type: ActionTypes.Progress_FetchGoogleSheetData,
}

function startingFetchedData(): IActionsSuccess {
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
  readonly error: any,
  readonly type: ActionTypes.Failure_FetchGoogleSheetData,
}

function succesfullyFetchedData(error: any): IActionsFailure {
  return {
      googleSheetDataError: error,
      type: ActionTypes.Failure_FetchGoogleSheetData,
  }
}
