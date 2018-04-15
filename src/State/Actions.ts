import { Dispatch } from 'redux';
import IStoreState from './IStoreState';

import axios from 'axios';
import { credentials } from './client_secret';

const google = require('googleapis');

google.load("client", () => { 
    console.log(credentials);
});

export enum ActionTypes {
    Progress_FetchGoogleSheetData = 'PROGRESS_FetchGoogleSheetData',
    Success_FetchGoogleSheetData = 'SUCCESS_FetchGoogleSheetData',
    Failure_FetchGoogleSheetData = 'FAILURE_FetchGoogleSheetData',
}

export function fetchGoogleSheetData(): (dispatch: Dispatch<IStoreState>) => Promise<void> {
    return (dispatch: Dispatch<IStoreState>) => {
        dispatch(startingFetchedData());

        return axios.get('/user?ID=12345')
            .then((response) => {
                dispatch(succesfullyFetchedData([ 'test data' ]));
            })
            .catch((error) => {
                dispatch(failedFetchedData('ERROR'));
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