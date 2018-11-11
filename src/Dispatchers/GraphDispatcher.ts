import axios from "axios";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { UpdateGraph } from "../State/DatabaseActions";
import { IUser } from "../Types/Users";
import Event from "../Utils/Event";
import { showToast } from "../Utils/Toaster";
import { convertPayloadToUser } from "../Utils/Util";
import { retrieveURL } from "./Utils";

/**
 * Do not import this directly, import DatabaseDispatcher instead. Components
 * should not need to know where the dispatcher actions are coming from.
 */
export class GraphDispatcher {
  public constructor(private dispatch: Dispatch) {}

  public getGraph = async (user: IUser | undefined) => {
    try {
      if (
        user === undefined ||
        user.connections === undefined ||
        Object.values(user.connections).length === 0
      ) {
        throw new Error(`Cannot fetch for user: ${user}`);
      }
      const [rawUsers, rawEvents] = await Promise.all([
        axios.post(retrieveURL("users/getMany"), {
          ids: Object.keys(user.connections)
        }),
        axios.post(retrieveURL("events/getMany"), {
          eventIds: Object.values(user.connections).reduce(
            (previous, next) => previous.concat(next),
            []
          )
        })
      ]);
      const users = rawUsers.data.payload.map(convertPayloadToUser);
      const events = rawEvents.data.payload.map(
        (rawEvent: any) =>
          new Event(
            rawEvent._id,
            new Date(rawEvent.date),
            rawEvent.description,
            this.mapToUsers(rawEvent.attendees, users)
          )
      );
      this.dispatch(UpdateGraph.create({ users, events }));
    } catch (error) {
      showToast(
        Intent.DANGER,
        "We were unable to retrieve your graph. Try logging out or refreshing the page?"
      );
    }
  };

  private mapToUsers(ids: string[], users: IUser[]) {
    return ids.map(id => users.find(user => user.id === id) as IUser);
  }
}
