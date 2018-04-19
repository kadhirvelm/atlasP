import { ActionTypes as G_ActionTypes } from './GoogleSheetActions';
import { ActionTypes } from './WebsiteActions';

export default function WebsiteReducer(
  state = {},
  action: any,
) {
  switch(action.type){
    case G_ActionTypes.Success_FetchGoogleSheetData:
      return Object.assign({}, state, {
        infoPerson: undefined,
        mainPerson: undefined,
      })
    case ActionTypes.Set_Main_Person:
      return Object.assign({}, state, {
        mainPerson: action.mainPerson,
      })
    case ActionTypes.Set_Info_Person:
      return Object.assign({}, state, {
        infoPerson: action.infoPerson,
      })
    default:
      return state
  }
}