import axios from "axios";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { ForceUpdate, Login } from "../State/DatabaseActions";
import { IRawUser } from "../Types/Users";
import { saveAuthenticationToken, securePassword } from "../Utils/Security";
import { showToast } from "../Utils/Toaster";
import { retrieveURL } from "./Utils";

/**
 * Do not import this directly, import DatabaseDispatcher instead. Components
 * should not need to know where the dispatcher actions are coming from.
 */
export class AuthenticationDispatcher {
  public constructor(private dispatch: Dispatch) {}

  public login = async (
    phoneNumber: string,
    password: string | undefined,
    temporaryPassword?: string
  ) => {
    try {
      const loginResponse = await axios.post(retrieveURL("users/login"), {
        password: securePassword(password),
        phoneNumber,
        temporaryPassword
      });
      saveAuthenticationToken(loginResponse.data.payload.token);
      this.dispatch(
        Login.create(loginResponse.data.payload.userDetails as IRawUser)
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        "It doesn't seem like these are valid login credentials."
      );
    }
  };

  public claim = async (phoneNumber: string) => {
    try {
      const claimResponse = await axios.post(retrieveURL("users/claim"), {
        phoneNumber
      });
      this.dispatch(
        ForceUpdate.create({
          _id: claimResponse.data.payload._id,
          fields: "password"
        })
      );
      this.login(
        phoneNumber,
        undefined,
        claimResponse.data.payload.temporaryPassword
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        "Hum, looks like this user either doesn't exist or has already been claimed. Contact an admin if you think this is a mistake."
      );
    }
  };

  public resetClaim = async (phoneNumber: string) => {
    return new Promise(async resolve => {
      const resetClaimResponse = await axios.post(retrieveURL("users/reset"), {
        phoneNumber
      });
      showToast(Intent.SUCCESS, resetClaimResponse.data.payload.message);
      resolve();
    });
  };
}
