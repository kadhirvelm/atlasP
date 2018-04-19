import { ActionTypes } from './GoogleSheetActions';

export default function GoogleSheetReducer(
  state = {
    fetching: false,
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
        eventData: action.eventData,
        fetching: false,
        googleSheetDataError: '',
        userData: action.userData,
      })
    case ActionTypes.Failure_FetchGoogleSheetData:
      return Object.assign({}, state, {
        fetching: false,
        googleSheetDataError: action.googleSheetDataError,
      })
    case ActionTypes.Change_Sign_In:
      return Object.assign({}, state, {
        isSignedIn: action.isSignedIn,
      })
    default:
      return state
  }
}