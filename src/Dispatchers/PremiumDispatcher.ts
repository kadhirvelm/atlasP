import axios from "axios";
import { CompoundAction } from "redoodle";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { FREQUENCIES } from "../Components/Common/Sliders/Utils";
import { RANGE_BOUND_FREQUENCY_FILTER } from "../Components/Navbar/NavbarComponents/Filters/FilterConstants";
import { SetPremiumStatus } from "../State/DatabaseActions";
import { AddGraphFilter, SetRangeFilter } from "../State/WebsiteActions";
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
      const premiumStatus = await axios.get(retrieveURL("account/check"));
      const isPremium: boolean = premiumStatus.data.payload.isPremium;
      const lowerBound = FREQUENCIES[0].value;
      const upperBound = FREQUENCIES[FREQUENCIES.length - 2].value;
      this.dispatch(
        CompoundAction.create([
          SetPremiumStatus.create(isPremium),
          AddGraphFilter.create(
            RANGE_BOUND_FREQUENCY_FILTER([lowerBound, upperBound])
          ),
          SetRangeFilter.create([lowerBound, upperBound])
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
