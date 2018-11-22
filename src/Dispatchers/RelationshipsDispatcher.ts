import axios from "axios";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { UpdateUser } from "../State/DatabaseActions";
import { showToast } from "../Utils/Toaster";
import { retrieveURL } from "./Utils";

/**
 * Do not import this directly, import DatabaseDispatcher instead. Components
 * should not need to know where the dispatcher actions are coming from.
 */
export class RelationshipsDispatcher {
  public constructor(private dispatch: Dispatch) {}

  public getAllRelationships = async () => {
    try {
      const allRelationships = await axios.get(
        retrieveURL("relationships/all")
      );
      const ignoreUsers = allRelationships.data.payload.ignoreUsers;
      this.dispatch(UpdateUser.create({ ignoreUsers }));
    } catch (error) {
      showToast(
        Intent.DANGER,
        "We weren't able to retrieve your relationships with your friends. Try refreshing the page?"
      );
    }
  };

  public updateUserIgnoreList = async (ignoreUsers: string[]) => {
    this.updateUserList(ignoreUsers, "ignoreUsers");
  };

  public updateFrequentUsersList = async (frequentUsers: string[]) => {
    this.updateUserList(frequentUsers, "frequentUsers");
  };

  public updateSemiFrequentUsersList = async (semiFrequentUsers: string[]) => {
    this.updateUserList(semiFrequentUsers, "semiFrequentUsers");
  };

  private updateUserList = async (userList: string[], key: string) => {
    try {
      await axios.post(retrieveURL("relationships/update"), {
        [key]: userList
      });
      this.dispatch(UpdateUser.create({ [key]: userList }));
    } catch (error) {
      showToast(
        Intent.DANGER,
        "Hum, something went wrong when updating that category. Try refreshing the page?"
      );
    }
  };
}
