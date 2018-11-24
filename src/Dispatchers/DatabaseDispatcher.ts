import axios from "axios";
import { Dispatch } from "redux";

import { IFinalPerson } from "../Components/Dialogs/AddNewUser";
import { IEvent } from "../Types/Events";
import { IUser } from "../Types/Users";
import { convertPayloadToUser } from "../Utils/Util";
import { AuthenticationDispatcher } from "./AuthenticationDispatcher";
import { EventDispatcher } from "./EventDispatcher";
import { GraphDispatcher } from "./GraphDispatcher";
import { PremiumDispatcher } from "./PremiumDispatcher";
import { RelationshipsDispatcher } from "./RelationshipsDispatcher";
import { UserDispatcher } from "./UserDispatcher";
import { retrieveURL } from "./Utils";

/**
 * Send requests to the API through this class.
 */
export class DatabaseDispatcher {
  private authenticationDispatcher: AuthenticationDispatcher;
  private eventDisptcher: EventDispatcher;
  private graphDispatcher: GraphDispatcher;
  private userDispatcher: UserDispatcher;
  private relationshipDispatcher: RelationshipsDispatcher;
  private premiumDispatcher: PremiumDispatcher;

  public constructor(dispatch: Dispatch) {
    this.authenticationDispatcher = new AuthenticationDispatcher(dispatch);
    this.eventDisptcher = new EventDispatcher(dispatch);
    this.graphDispatcher = new GraphDispatcher(dispatch);
    this.userDispatcher = new UserDispatcher(dispatch);
    this.relationshipDispatcher = new RelationshipsDispatcher(dispatch);
    this.premiumDispatcher = new PremiumDispatcher(dispatch);
  }

  public async checkServerStatus() {
    try {
      await axios.get(retrieveURL(""), { timeout: 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Authentication Dispatcher
   */

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

  /**
   * Event Dispatcher
   */

  public createNewEvent = async (event: IEvent) => {
    return this.eventDisptcher.createNewEvent(event);
  };

  public deleteEvent = async (event: IEvent) => {
    this.eventDisptcher.deleteEvent(event);
  };

  public updateEvent = async (event: IEvent) => {
    this.eventDisptcher.updateEvent(event);
  };

  /**
   * Graph Dispatcher
   */

  public getGraph = async (user: IUser | undefined) => {
    return this.graphDispatcher.getGraph(user);
  };

  public getLatestGraph = async (user: IUser) => {
    const latestUser = await this.getUpdatedUser(user);
    if (latestUser === undefined) {
      return;
    }
    await this.getGraph(convertPayloadToUser(latestUser));
    await this.checkPremiumStatus();
    await this.getAllRelationships();
  };

  /**
   * Premium Dispatcher
   */

  public checkPremiumStatus = async () => {
    return this.premiumDispatcher.getPremiumStatus();
  };

  /**
   * Relationship Dispatcher
   */

  public getAllRelationships = async () => {
    return this.relationshipDispatcher.getAllRelationships();
  };

  public updateUserIgnoreList = async (ignoreUsers: string[]) => {
    return this.relationshipDispatcher.updateUserIgnoreList(ignoreUsers);
  };

  public updateFrequentUsersList = async (frequentUsers: string[]) => {
    return this.relationshipDispatcher.updateFrequentUsersList(frequentUsers);
  };

  public updateSemiFrequentUsersList = async (semiFrequentUsers: string[]) => {
    return this.relationshipDispatcher.updateSemiFrequentUsersList(
      semiFrequentUsers
    );
  };

  /**
   * User Dispatcher
   */

  public addToGraphFromPhoneNumber = async (
    phoneNumber: string,
    successCallback: () => void
  ) => {
    return this.userDispatcher.addToGraphFromPhoneNumber(
      phoneNumber,
      successCallback
    );
  };

  public getUpdatedUser = async (user: IUser) => {
    return this.userDispatcher.getUpdatedUser(user);
  };

  public createNewUser = async (user: IFinalPerson) => {
    return this.userDispatcher.createNewUser(user);
  };

  public removeFromGraph = async (removeConnection: string, name: string) => {
    return this.userDispatcher.removeFromGraph(removeConnection, name);
  };

  public updateUser = async (newUserDetails: IUser) => {
    return this.userDispatcher.updateUser(newUserDetails);
  };

  public updateOtherUser = async (
    user: Pick<IUser, "claimed" | "id">,
    newOtherUserDetails: Pick<IUser, "gender" | "location" | "name">,
    currentUserId: string
  ) => {
    return this.userDispatcher.updateOtherUser(
      user,
      newOtherUserDetails,
      currentUserId
    );
  };
}
