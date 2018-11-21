import axios from "axios";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { SetPremiumStatus } from "../State/DatabaseActions";
import { showToast } from "../Utils/Toaster";
import { retrieveURL } from "./Utils";

/**
 * Do not import this directly, import DatabaseDispatcher instead. Components
 * should not need to know where the dispatcher actions are coming from.
 */
export class PremiumDispatcher {
  public constructor(private dispatch: Dispatch) {}

  public getPremiumStatus = async () => {
    try {
      const premiumStatus = await axios.get(retrieveURL("premium/check"));
      const isPremium = premiumStatus.data.payload.isPremium;
      this.dispatch(SetPremiumStatus.create(isPremium));
    } catch (error) {
      showToast(
        Intent.DANGER,
        "We weren't able to retrieve your relationships with your friends. Try refreshing the page?"
      );
    }
  };
}
