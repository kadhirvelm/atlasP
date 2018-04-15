import { ActionTypes } from './Actions';

export default function reducer(
  state = {
    fetching: false,
    googleSheetData: [],
  },
  action: any,
) {
  switch(action.type){
    case ActionTypes.Progress_FetchGoogleSheetData:
      return Object.assign({}, state, {
        fetching: true,
      })
    case ActionTypes.Success_FetchGoogleSheetData:
      return Object.assign({}, state, {
        fetching: false,
        googleSheetData: action.googleSheetData,
      })
    case ActionTypes.Failure_FetchGoogleSheetData:
      return Object.assign({}, state, {
        fetching: false,
        googleSheetDataError: action.googleSheetDataError,
      })
    default:
      return state
  }
}