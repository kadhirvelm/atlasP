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
      const fetchedRelationships = allRelationships.data.payload;
      this.dispatch(UpdateUser.create({ ...fetchedRelationships }));
    } catch (error) {
      showToast(
        Intent.DANGER,
        "We weren't able to retrieve your relationships with your friends. Try refreshing the page?"
      );
    }
  };
}