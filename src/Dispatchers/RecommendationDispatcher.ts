import { Intent } from "@blueprintjs/core";
import axios from "axios";
import { Dispatch } from "react-redux";
import { DisplayRecommendation } from "../State/WebsiteActions";
import { showToast } from "../Utils/Toaster";
import { convertPayloadToUser } from "../Utils/Util";
import { retrieveURL } from "./Utils";

export class RecommendationDispatcher {
  public constructor(private dispatch: Dispatch) {}

  public getShouldDisplayRecommendationDialog = async () => {
    try {
      const shouldDisplayRecommendationDialog = await axios.get(
        retrieveURL("recommendations/read")
      );
      this.dispatch(
        DisplayRecommendation.create(
          convertPayloadToUser(shouldDisplayRecommendationDialog.data.payload)
        )
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        "Hum, something went wrong. Try logging out and refreshing the page?"
      );
    }
  };

  public writeHasSeenDisplayRecommendation = async () => {
    try {
      await axios.get(retrieveURL("recommendations/write"));
      this.dispatch(DisplayRecommendation.create(undefined));
    } catch (error) {
      showToast(
        Intent.DANGER,
        "Hum, we weren't able to finish viewing your recommendation. Try refreshing the page?"
      );
    }
  };
}
