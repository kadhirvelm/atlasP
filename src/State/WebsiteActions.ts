import { Dispatch } from 'redux';
import User from '../Helpers/User';
import IStoreState from './IStoreState';

export enum ActionTypes {
    Set_Main_Person = 'Set_Main_Person',
    Set_Info_Person = 'Set_Info_Person',
    Change_Person = 'Change_Person',
}

export function setMainPerson(user: User): (dispatch: Dispatch<IStoreState>) => void {
    return (dispatch: Dispatch<IStoreState>) => {
        dispatch(setMain(user));
    };
}

interface IActionsSetMain {
  readonly type: ActionTypes.Set_Main_Person;
  readonly mainPerson: User;
}

function setMain(mainPerson: User): IActionsSetMain {
  return {
      mainPerson,
      type: ActionTypes.Set_Main_Person,
  }
}

export function setInfoPerson(user: User): (dispatch: Dispatch<IStoreState>) => void {
    return (dispatch: Dispatch<IStoreState>) => {
        dispatch(setInfo(user))
    }
}

interface IActionsSetInfo {
    readonly type: ActionTypes.Set_Info_Person;
    readonly infoPerson: User;
}

function setInfo(infoPerson: User): IActionsSetInfo {
    return {
        infoPerson,
        type: ActionTypes.Set_Info_Person,
    }
}

export function setParty(party: string[]): (dispatch: Dispatch<IStoreState>) => void {
    return (dispatch: Dispatch<IStoreState>) => {
        dispatch(changeParty(party))
    }
}

interface IActionsChangeParty {
    readonly party: string[],
    readonly type: ActionTypes.Change_Person;
}

function changeParty(party: string[]): IActionsChangeParty {
    return {
        party,
        type: ActionTypes.Change_Person,
    }
}