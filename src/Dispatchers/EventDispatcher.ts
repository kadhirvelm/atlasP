import axios from "axios";
import { CompoundAction } from "redoodle";
import { Dispatch } from "redux";

import { Intent } from "@blueprintjs/core";

import { UpdateEventData } from "../State/DatabaseActions";
import { SelectEvent } from "../State/WebsiteActions";
import { IEvent } from "../Types/Events";
import Event from "../Utils/Event";
import { showToast } from "../Utils/Toaster";
import { retrieveURL } from "./Utils";

/**
 * Do not import this directly, import DatabaseDispatcher instead. Components
 * should not need to know where the dispatcher actions are coming from.
 */
export class EventDispatcher {
  public constructor(private dispatch: Dispatch) {}

  public createNewEvent = async (event: IEvent) => {
    try {
      const response = await axios.post(
        retrieveURL("events/new"),
        this.formatEvent(event)
      );
      this.dispatch(
        UpdateEventData.create(
          new Event(
            response.data.payload.id,
            new Date(event.date),
            event.description,
            event.attendees
          )
        )
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        `Looks like there's something missing from the event: ${error.response.data.message.join(
          ", "
        )}`
      );
      throw error;
    }
  };

  public updateEvent = async (event: IEvent) => {
    try {
      const formattedEvent = this.formatEvent(event) as any;
      formattedEvent.eventId = event.id;
      delete formattedEvent.id;
      await axios.put(retrieveURL("events/update"), formattedEvent);
      this.dispatch(
        CompoundAction.create([
          SelectEvent.create(undefined),
          UpdateEventData.create(event)
        ])
      );
      showToast(
        Intent.SUCCESS,
        "Event updated successfully. Please refresh the page to update the graph."
      );
    } catch (error) {
      showToast(
        Intent.DANGER,
        `Hum, something went wrong when updating the event: ${error.response.data.message.join(
          ", "
        )}`
      );
      throw error;
    }
  };

  private formatEvent(event: IEvent) {
    return { ...event, attendees: event.attendees.map(user => user.id) };
  }
}
