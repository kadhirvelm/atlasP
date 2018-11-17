import axios from "axios";
import { CompoundAction } from "redoodle";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { IFinalPerson } from "../Components/Dialogs/AddNewUser";
import {
  ClearForceUpdate,
  UpdateOtherUser,
  UpdateUser,
  UpdateUserData
} from "../State/DatabaseActions";
import { IUser } from "../Types/Users";
import { securePassword } from "../Utils/Security";
import { showToast } from "../Utils/Toaster";
import User from "../Utils/User";
import { convertPayloadToUser, isValidPhoneNumber } from "../Utils/Util";
import { retrieveURL } from "./Utils";

/**
 * Do not import this directly, import DatabaseDispatcher instead. Components
 * should not need to know where the dispatcher actions are coming from.
 */
export class UserDispatcher {
  public constructor(private dispatch: Dispatch) {}

  public updateUser = async (newUserDetails: IUser) => {
    try {
      const finalUser = {
        gender: newUserDetails.gender,
        location: newUserDetails.location,
        name: newUserDetails.name,
        phoneNumber: newUserDetails.contact,
        ...(newUserDetails.password !== undefined && {
          password: securePassword(newUserDetails.password)
        })
      };
      await axios.put(retrieveURL("users/update"), finalUser);
      this.dispatch(
        CompoundAction.create([
          UpdateUser.create({ ...newUserDetails, password: undefined }),
          ClearForceUpdate.create()
        ])
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        `Hum, something went wrong. ${error.response.data.message.join(", ")}.`
      );
      throw error;
    }
  };

  public updateOtherUser = async (
    user: Pick<IUser, "claimed" | "id">,
    newUserDetails: Pick<IUser, "gender" | "location" | "name">
  ) => {
    try {
      if (user.claimed === true) {
        throw new Error("We cannot update a claimed user.");
      }
      await axios.put(retrieveURL("users/update-other"), {
        newUserDetails,
        userId: user.id
      });
      this.dispatch(
        UpdateOtherUser.create({ userId: user.id, newUserDetails })
      );
    } catch (error) {
      showToast(Intent.DANGER, `Hum something went wrong: ${error}`);
    }
  };

  public updateUserIgnoreList = async (ignoreUsers: string[]) => {
    try {
      await axios.put(retrieveURL("users/update"), { ignoreUsers });
      this.dispatch(UpdateUser.create({ ignoreUsers }));
    } catch (error) {
      showToast(
        Intent.DANGER,
        "Hum, something went wrong. Try refreshing the page?"
      );
    }
  };

  public getUpdatedUser = async (user: IUser) => {
    try {
      const rawUpdate = await axios.post(retrieveURL("users/getOne"), {
        id: user.id
      });
      const updatedUser = convertPayloadToUser(rawUpdate.data.payload[0]);
      if (updatedUser === undefined) {
        throw new Error("Latest fetched user is undefined.");
      }
      this.dispatch(UpdateUser.create(updatedUser));
      return updatedUser;
    } catch (error) {
      showToast(
        Intent.DANGER,
        "Something went wrong, try logging out and refreshing the page."
      );
      return undefined;
    }
  };

  public createNewUser = async (user: IFinalPerson) => {
    try {
      const response = await axios.post(retrieveURL("users/new-user"), {
        phoneNumber: "",
        ...user
      });
      this.dispatch(
        UpdateUserData.create(
          new User(
            response.data.payload.newUserId,
            user.name,
            user.gender,
            user.location,
            "",
            false
          )
        )
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        `There was a problem creating this user. ${error.response.data.message.join(
          ", "
        )}`
      );
      throw error;
    }
  };

  public addToGraphFromPhoneNumber = async (
    phoneNumber: string,
    successCallback: () => void
  ) => {
    if (!isValidPhoneNumber(phoneNumber)) {
      showToast(Intent.DANGER, `Invalid phone number: ${phoneNumber}`);
      return;
    }
    try {
      const response = await axios.post(retrieveURL("users/add-connection"), {
        phoneNumber
      });
      successCallback();
      const user = response.data.payload.user;
      this.dispatch(
        UpdateUserData.create(
          new User(user._id, user.name, user.gender, user.location, "", false)
        )
      );
      showToast(Intent.SUCCESS, response.data.payload.message);
    } catch (error) {
      showToast(Intent.DANGER, `${error.response.data.payload.error}`);
    }
  };

  public removeFromGraph = async (removeConnection: string) => {
    try {
      await axios.post(retrieveURL("users/remove-connection"), {
        removeConnection
      });
      showToast(
        Intent.SUCCESS,
        "Sweet, we've removed this person. Refresh your page to see your graph update!"
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        `We weren't able to remove this person from your graph: ${
          error.response.data.message[0]
        }`
      );
      throw error;
    }
  };
}
