import { Intent } from "@blueprintjs/core";
import { Dispatch } from "redux";

import { GoogleDispatcher } from "../../Dispatchers/GoogleDispatcher";
import Event from "../../Helpers/Event";
import { showToast } from "../../Helpers/Toaster";
import { IFinalEventChecked, IFinalEventEmpty } from "./AddNewEvent";

export class DialogUtils {
    private googleDispatch: GoogleDispatcher;
    private rawData: any;
    private resetStateAndClose: () => void;

    public constructor(private dispatch: Dispatch) {
        this.googleDispatch = new GoogleDispatcher(this.dispatch);
    }

    public setReset(resetStateAndClose: () => void) {
        this.resetStateAndClose = resetStateAndClose;
    }

    public setData(rawData: any) {
        this.rawData = rawData;
    }

    public submitFinalEvent(finalEvent: IFinalEventEmpty) {
        if (this.isCompleteEvent(finalEvent)) {
            finalEvent.attendees.push(finalEvent.host);
            this.sendEventAndUsersToAPI(finalEvent);
        } else {
            showToast(Intent.DANGER, "Cannot leave fields blank.");
        }
    }
    
    private sendEventAndUsersToAPI = async (finalEvent: IFinalEventChecked) => {
        const newEvent = new Event(
            this.assembleEventID(finalEvent),
            finalEvent.host.id,
            finalEvent.date,
            finalEvent.description
        );
        const resolution = await this.googleDispatch.writeData(newEvent, finalEvent.attendees, this.rawData);
        if (resolution) {
            showToast(Intent.SUCCESS, "Successfully created event.");
            this.resetStateAndClose()
        } else {
            showToast(Intent.DANGER, "Error writing data to sheet. Check console for more details.");
        }
    }
    
    private assembleEventID = (finalEvent: IFinalEventChecked) => (finalEvent.host.id + '_' + finalEvent.date).replace(/\s/g, "_");
    
    private isCompleteEvent(finalEvent: IFinalEventEmpty): finalEvent is IFinalEventChecked {
        return (
            finalEvent.host !== undefined &&
            finalEvent.attendees.length > 0 &&
            finalEvent.date !== "" &&
            finalEvent.description !== ""
        );
    }
}