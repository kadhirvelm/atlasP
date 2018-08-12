import { Button, Classes, Intent } from "@blueprintjs/core";
import * as React from "react";
import { Dispatch } from "redux";

import { GoogleDispatcher } from "../../Dispatchers/GoogleDispatcher";
import Event from "../../Helpers/Event";
import { showToast } from "../../Helpers/Toaster";
import { IFinalEventChecked, IFinalEventEmpty } from "./AddNewEvent";
import { IFinalPerson } from "./AddNewUser";

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

    public submitFinalPerson(finalPerson: IFinalPerson) {
        if (this.isCompletePerson(finalPerson)) {
            this.sendUserToAPI(finalPerson);
        } else {
            showToast(Intent.DANGER, "Cannot leave fields blank/some fields are incorrect.");
        }
    }

    public submitFinalEvent(finalEvent: IFinalEventEmpty): Error | void {
        if (this.isCompleteEvent(finalEvent)) {
            finalEvent.attendees.push(finalEvent.host);
            this.sendEventAndUsersToAPI(finalEvent);
        } else {
            showToast(Intent.DANGER, "Cannot leave fields blank.");
            throw new Error("Event missing fields.");
        }
    }

    public returnFooterActions(onClose: () => void, handleSubmit: () => void, isActive?: boolean) {
        return (
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={onClose} text="Cancel" />
                    <Button intent={Intent.PRIMARY} loading={isActive} onClick={handleSubmit} text="Submit" />
                </div>
            </div>
        )
    }

    private isCompletePerson(finalPerson: IFinalPerson) {
        if (
            parseInt(finalPerson.age, 10) !== undefined &&
            finalPerson.fullName.length > 0 &&
            finalPerson.location.length > 0 &&
            (finalPerson.gender === "F" || finalPerson.gender === "M" || finalPerson.gender === "X")) {
            return true;
        }
        return false;
    }

    private sendUserToAPI = async (finalPerson: IFinalPerson) => {
        const resolution = await this.googleDispatch.writeNewUserData(finalPerson, this.rawData);
        if (resolution) {
            showToast(Intent.SUCCESS, "Successfully created a new user.");
            this.resetStateAndClose();
        } else {
            showToast(Intent.DANGER, "Error writing person to the database. Check console for more details.");
        }
    }
    
    private sendEventAndUsersToAPI = async (finalEvent: IFinalEventChecked) => {
        const newEvent = new Event(
            this.assembleEventID(finalEvent),
            finalEvent.host.id,
            finalEvent.date,
            finalEvent.description
        );
        const resolution = await this.googleDispatch.writeEventData(newEvent, finalEvent.attendees, this.rawData);
        if (resolution) {
            showToast(Intent.SUCCESS, "Successfully created event.");
            this.resetStateAndClose();
        } else {
            showToast(Intent.DANGER, "Error writing data to the database. Check console for more details.");
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