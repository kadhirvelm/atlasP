import { Dispatch } from "redux";

import { IFinalPerson } from "../Components/Dialogs/AddNewUser";
import { IEvent } from "../Types/Events";
import { IUser } from "../Types/Users";
import { convertPayloadToUser } from "../Utils/Util";
import { AuthenticationDispatcher } from "./AuthenticationDispatcher";
import { EventDispatcher } from "./EventDispatcher";
import { GraphDispatcher } from "./GraphDispatcher";
import { UserDispatcher } from "./UserDispatcher";

/**
 * Send requests to the API through this class.
 */
export class DatabaseDispatcher {
  private authenticationDispatcher: AuthenticationDispatcher;
  private eventDisptcher: EventDispatcher;
  private graphDispatcher: GraphDispatcher;
  private userDispatcher: UserDispatcher;

  public constructor(dispatch: Dispatch) {
    this.authenticationDispatcher = new AuthenticationDispatcher(dispatch);
    this.eventDisptcher = new EventDispatcher(dispatch);
    this.graphDispatcher = new GraphDispatcher(dispatch);
    this.userDispatcher = new UserDispatcher(dispatch);
  }

  public login = async (
    phoneNumber: string,
    password: string | undefined,
    temporaryPassword?: string
  ) => {
    return this.authenticationDispatcher.login(
      phoneNumber,
      password,
      temporaryPassword
    );
  };

  public claim = async (phoneNumber: string) => {
    return this.authenticationDispatcher.claim(phoneNumber);
  };

  public resetClaim = async (phoneNumber: string) => {
    return this.authenticationDispatcher.resetClaim(phoneNumber);
  };

  public updateUser = async (newUserDetails: IUser) => {
    return this.userDispatcher.updateUser(newUserDetails);
  };

  public updateOtherUser = async (
    user: Pick<IUser, "claimed" | "id">,
    newOtherUserDetails: Pick<IUser, "gender" | "location" | "name">
  ) => {
    return this.userDispatcher.updateOtherUser(user, newOtherUserDetails);
  };

  public updateUserIgnoreList = async (ignoreUsers: string[]) => {
    return this.userDispatcher.updateUserIgnoreList(ignoreUsers);
  };

  public getUpdatedUser = async (user: IUser) => {
    return this.userDispatcher.getUpdatedUser(user);
  };

  public getGraph = async (user: IUser | undefined) => {
    return this.graphDispatcher.getGraph(user);
  };

  public getLatestGraph = async (user: IUser) => {
    const latestUser = await this.getUpdatedUser(user);
    if (latestUser === undefined) {
      return;
    }
    await this.getGraph(convertPayloadToUser(latestUser));
  };

  public createNewUser = async (user: IFinalPerson) => {
    return this.userDispatcher.createNewUser(user);
  };

  public createNewEvent = async (event: IEvent) => {
    return this.eventDisptcher.createNewEvent(event);
  };

  public updateEvent = async (event: IEvent) => {
    this.eventDisptcher.updateEvent(event);
  };

  public removeFromGraph = async (removeConnection: string) => {
    return this.userDispatcher.removeFromGraph(removeConnection);
  };
}
