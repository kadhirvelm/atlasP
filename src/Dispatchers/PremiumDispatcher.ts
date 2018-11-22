import axios from "axios";
import { CompoundAction } from "redoodle";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { CATEGORY_FILTER } from "../Components/Navbar/NavbarComponents/Filters/FilterConstants";
import { SetPremiumStatus } from "../State/DatabaseActions";
import { AddGraphFilter } from "../State/WebsiteActions";
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
      const isPremium: boolean = premiumStatus.data.payload.isPremium;
      this.dispatch(
        CompoundAction.create([
          SetPremiumStatus.create(isPremium),
          AddGraphFilter.create(CATEGORY_FILTER("ignoreUsers"))
        ])
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        "We weren't able to retrieve your relationships with your friends. Try refreshing the page?"
      );
    }
  };
}
